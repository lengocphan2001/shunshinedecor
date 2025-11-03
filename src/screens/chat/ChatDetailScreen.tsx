import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  PanResponder,
  Alert,
  Image,
  ActivityIndicator,
  Modal,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import MainLayout from '../../components/layout/MainLayout';
import Breadcrumb from '../../components/common/Breadcrumb';
import { generateBreadcrumbItems } from '../../utils/breadcrumbUtils';
import { typography, spacing, useTheme } from '../../theme';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { ChatMessage, TopicCategory, TOPIC_CATEGORY_KEYS } from '../../types/chat';
import ConfigScreen from '../../components/screens/ConfigScreen';
import MediaScreen from '../../components/screens/MediaScreen';
import socketService from '../../services/socket.service';
import { useSocket } from '../../contexts/SocketContext';
import { useAuth } from '../../contexts/AuthContext';
import ImagePicker from 'react-native-image-crop-picker';
import { uploadFileApi, UploadedFile } from '../../api/upload';
import ImageViewing from 'react-native-image-viewing';
import { editImageWithCropRotate } from '../../components/modals/ImageEditorModal';
import { pick } from '@react-native-documents/picker';
import { viewDocument } from '@react-native-documents/viewer';
import RNFS from 'react-native-fs';
import { Linking } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface ChatDetailScreenProps {
  chatId: string;
  chatName: string;
  unreadCount?: number;
  onGoBack: () => void;
  navigationStack?: any[];
  onNavigateToScreen?: (screen: any, params?: any) => void;
}

// Topic Post interface
interface TopicPost {
  id: string;
  authorId: string;
  authorName: string;
  category: TopicCategory;
  content: string;
  attachments?: Array<{
    url: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
  }>;
  comments: {
    id: string;
    authorId: string;
    authorName: string;
    content: string;
    timestamp: Date;
  }[];
  likes: string[];
  approved: boolean;
  approvedBy?: string;
  approvedAt?: Date;
  approvalSignature?: string; // SVG path data for signature
  timestamp: Date;
}

export default function ChatDetailScreen({
  chatId,
  chatName,
  unreadCount = 0,
  onGoBack,
  navigationStack,
  onNavigateToScreen,
}: ChatDetailScreenProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user } = useAuth();
  const { isConnected } = useSocket();
  
  const [activeTab, setActiveTab] = useState<'topic' | 'chat'>('topic');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [topicPosts, setTopicPosts] = useState<TopicPost[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<TopicCategory | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  
  // File upload states
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<UploadedFile[]>([]);
  
  // Image viewer state
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [imageViewerIndex, setImageViewerIndex] = useState(0);
  const [imageViewerImages, setImageViewerImages] = useState<Array<{ uri: string }>>([]);
  
  // Approve modal state
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [approvingPostId, setApprovingPostId] = useState<string | null>(null);
  const [signaturePath, setSignaturePath] = useState<string>('');
  
  // Gesture states
  const [showConfig, setShowConfig] = useState(false);
  const [showMedia, setShowMedia] = useState(false);
  const translateX = useState(new Animated.Value(0))[0];
  
  const scrollViewRef = useRef<ScrollView>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Signature pad dimensions
  const { width: screenWidth } = Dimensions.get('window');
  const signaturePadWidth = screenWidth - 80;
  const signaturePadHeight = 150;
  
  const styles = createStyles(colors);

  // Initialize socket connection and join rooms
  useEffect(() => {
    console.log('ChatDetailScreen - isConnected:', isConnected, 'chatId:', chatId, 'activeTab:', activeTab);
    
    if (!isConnected) {
      console.log('Socket not connected yet, waiting...');
      return;
    }

    if (!chatId) {
      console.error('No chatId provided!');
      return;
    }

    console.log('Joining chat room:', chatId);
    
    // Join rooms based on active tab
    if (activeTab === 'chat') {
      console.log('Emitting chat:join event');
      socketService.joinChatRoom(chatId);
    } else {
      console.log('Emitting topic:join event');
      socketService.joinTopicRoom(chatId);
    }

    // Setup event listeners
    setupSocketListeners();

    return () => {
      // Cleanup listeners on unmount
      cleanupSocketListeners();
    };
  }, [isConnected, chatId, activeTab]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0 && activeTab === 'chat') {
      // Instant scroll without animation (like Messenger)
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        scrollViewRef.current?.scrollToEnd({ animated: false });
      });
    }
  }, [messages.length, activeTab]);

  const setupSocketListeners = () => {
    // Chat message history
    socketService.onChatHistory((data: { chatRoomId: string; messages: any[] }) => {
      console.log('Received chat history:', data.messages.length);
      const formattedMessages: ChatMessage[] = data.messages.map((msg: any) => ({
        id: msg._id || msg.id,
        senderId: msg.senderId,
        senderName: msg.senderName,
        content: msg.content,
        timestamp: new Date(msg.createdAt || msg.timestamp),
        isRead: msg.readBy?.includes(user?.id) || false,
        // Include attachments from database
        attachments: msg.attachments || [],
      }));
      console.log('Formatted messages with attachments:', formattedMessages.map(m => ({ 
        id: m.id, 
        hasAttachments: (m as any).attachments?.length > 0,
        attachments: (m as any).attachments 
      })));
      setMessages(formattedMessages);
      
      // Auto-scroll to bottom when messages are loaded - instant, no animation
      requestAnimationFrame(() => {
        scrollViewRef.current?.scrollToEnd({ animated: false });
      });
    });

    // New chat message
    socketService.onChatMessage((data: { message: any }) => {
      console.log('Received new message:', data.message);
      console.log('Message attachments:', data.message.attachments);
      const newMessage: ChatMessage = {
        id: data.message.id,
        senderId: data.message.senderId,
        senderName: data.message.senderName,
        content: data.message.content,
        timestamp: new Date(data.message.timestamp),
        isRead: false,
        // Include attachments from socket message
        attachments: data.message.attachments || [],
      };
      setMessages(prev => [...prev, newMessage]);
      
      // Auto-scroll to bottom when new message arrives - instant, no animation
      requestAnimationFrame(() => {
        scrollViewRef.current?.scrollToEnd({ animated: false });
      });
    });

    // Typing indicator
    socketService.onChatTyping((data: { userId: string; userName: string; isTyping: boolean }) => {
      if (data.userId !== user?.id) {
        setTypingUsers(prev => {
          if (data.isTyping) {
            return [...prev, data.userName];
          } else {
            return prev.filter(name => name !== data.userName);
          }
        });
      }
    });

    // Topic history
    socketService.onTopicHistory((data: { chatRoomId: string; posts: any[] }) => {
      console.log('Received topic history:', data.posts.length);
      const formattedPosts: TopicPost[] = data.posts.map((post: any) => ({
        id: post._id || post.id,
        authorId: post.authorId,
        authorName: post.authorName,
        category: post.category,
        content: post.content,
        attachments: post.attachments || [],
        comments: post.comments?.map((c: any) => ({
          id: c.id,
          authorId: c.authorId,
          authorName: c.authorName,
          content: c.content,
          timestamp: new Date(c.timestamp),
        })) || [],
        likes: post.likes || [],
        approved: post.approved || false,
        approvedBy: post.approvedBy,
        approvedAt: post.approvedAt ? new Date(post.approvedAt) : undefined,
        approvalSignature: post.approvalSignature,
        timestamp: new Date(post.createdAt || post.timestamp),
      }));
      // Sort by timestamp ascending (oldest first, like chat tab)
      const sortedPosts = formattedPosts.sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      setTopicPosts(sortedPosts);
      
      // Auto-scroll to bottom for topic posts (newest last, like chat tab)
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: false });
      }, 100);
    });

    // New topic post
    socketService.onTopicPost((data: { post: any }) => {
      console.log('Received new topic post:', data.post);
      const newPost: TopicPost = {
        id: data.post.id,
        authorId: data.post.authorId,
        authorName: data.post.authorName,
        category: data.post.category,
        content: data.post.content,
        attachments: data.post.attachments || [],
        comments: [],
        likes: [],
        approved: data.post.approved || false,
        approvedBy: data.post.approvedBy,
        approvedAt: data.post.approvedAt ? new Date(data.post.approvedAt) : undefined,
        approvalSignature: data.post.approvalSignature,
        timestamp: new Date(data.post.timestamp),
      };
      // Add new post to the end (oldest first, newest last, like chat tab)
      setTopicPosts(prev => {
        const updated = [...prev, newPost];
        // Sort by timestamp to maintain order
        return updated.sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
      });
      
      // Auto-scroll to bottom when new post arrives
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: false });
      }, 100);
    });

    // Topic approve
    socketService.onTopicApprove((data: { postId: string; approved: boolean; approvedBy?: string; approvedAt?: Date; approvalSignature?: string }) => {
      console.log('Received topic approve:', data);
      setTopicPosts(prev => prev.map(post => 
        post.id === data.postId 
          ? { ...post, approved: data.approved, approvedBy: data.approvedBy, approvedAt: data.approvedAt ? new Date(data.approvedAt) : undefined, approvalSignature: data.approvalSignature }
          : post
      ));
    });

    // Topic comment
    socketService.onTopicComment((data: { postId: string; comment: any }) => {
      console.log('Received topic comment:', data);
      setTopicPosts(prev => prev.map(post => {
        if (post.id === data.postId) {
          return {
            ...post,
            comments: [...post.comments, {
              id: data.comment.id,
              authorId: data.comment.authorId,
              authorName: data.comment.authorName,
              content: data.comment.content,
              timestamp: new Date(data.comment.timestamp),
            }],
          };
        }
        return post;
      }));
    });


    // User status
    socketService.onUserOnline((data: { userId: string }) => {
      setOnlineUsers(prev => new Set([...prev, data.userId]));
    });

    socketService.onUserOffline((data: { userId: string }) => {
      setOnlineUsers(prev => {
        const updated = new Set(prev);
        updated.delete(data.userId);
        return updated;
      });
    });
  };

  const cleanupSocketListeners = () => {
    socketService.off('chat:history');
    socketService.off('chat:message');
    socketService.off('chat:typing');
    socketService.off('topic:history');
    socketService.off('topic:post');
    socketService.off('topic:comment');
    socketService.off('user:online');
    socketService.off('user:offline');
  };

  // Gesture handlers
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > 10;
    },
    onPanResponderMove: (evt, gestureState) => {
      // Optional: Add real-time feedback during pan
    },
    onPanResponderRelease: (evt, gestureState) => {
      const { dx } = gestureState;
      
      if (dx > 50) {
        // Swipe right - show media
        setShowMedia(true);
        setShowConfig(false);
        Animated.timing(translateX, {
          toValue: -300,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else if (dx < -50) {
        // Swipe left - show config
        setShowConfig(true);
        setShowMedia(false);
        Animated.timing(translateX, {
          toValue: 300,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const handleCloseSidePanels = () => {
    setShowConfig(false);
    setShowMedia(false);
    Animated.timing(translateX, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const getTopicStyle = (category: TopicCategory) => {
    const colorMap: Record<TopicCategory, string> = {
      quality: colors.danger,
      schedule: colors.status.onSchedule,
      drawing: colors.warning,
      others: colors.neutral,
    };
    const tone = colorMap[category];
    return {
      button: {
        backgroundColor: colors.cardBackground,
        borderWidth: 1,
        borderColor: tone,
      },
      buttonText: {
        color: tone,
        fontWeight: '600',
      },
      chip: {
        backgroundColor: colors.cardBackground,
        borderWidth: 1,
        borderColor: tone,
      },
      chipText: {
        color: tone,
        fontWeight: '600',
      },
    } as const;
  };

  const handleSendMessage = () => {
    // Allow sending if either has text or has files
    if (!inputText.trim() && selectedFiles.length === 0) {
      console.log('Empty input and no files, ignoring');
      return;
    }

    console.log('handleSendMessage - activeTab:', activeTab, 'isConnected:', isConnected, 'chatId:', chatId);

    if (!isConnected) {
      console.error('Socket not connected!');
      Alert.alert('Error', 'Not connected to server. Please check your connection.');
      return;
    }

    if (activeTab === 'chat') {
      // Send chat message with optional attachments
      console.log('Sending chat message:', inputText.trim(), 'attachments:', selectedFiles);
      const content = inputText.trim() || '📎 File attachment';
      socketService.sendChatMessage(chatId, content, selectedFiles.length > 0 ? selectedFiles : undefined);
      setInputText('');
      setSelectedFiles([]);
      
      // Stop typing indicator
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      socketService.sendTypingIndicator(chatId, false);
    } else if (activeTab === 'topic' && selectedTopic) {
      // Send topic post with files
      console.log('Sending topic post:', selectedTopic, inputText.trim(), 'attachments:', selectedFiles);
      const content = inputText.trim() || (selectedFiles.length > 0 ? '📎 File attachment' : '');
      socketService.createTopicPost(chatId, selectedTopic, content, selectedFiles.length > 0 ? selectedFiles : undefined);
      setInputText('');
      setSelectedFiles([]);
      setSelectedTopic(null);
    } else {
      console.log('No topic selected, ignoring');
    }
  };

  const handleInputChange = (text: string) => {
    setInputText(text);

    if (activeTab === 'chat') {
      // Send typing indicator
      socketService.sendTypingIndicator(chatId, text.length > 0);

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing after 2 seconds of no input
      if (text.length > 0) {
        typingTimeoutRef.current = setTimeout(() => {
          socketService.sendTypingIndicator(chatId, false);
        }, 2000) as any;
      }
    }
  };

  const handleTopicComment = (postId: string, content: string) => {
    if (content.trim()) {
      socketService.addTopicComment(postId, content.trim());
    }
  };

  const handleTopicApprove = (postId: string) => {
    setApprovingPostId(postId);
    setApproveModalVisible(true);
    setSignaturePath('');
  };

  const handleApproveConfirm = () => {
    if (approvingPostId) {
      socketService.approveTopicPost(approvingPostId, signaturePath);
      setApproveModalVisible(false);
      setApprovingPostId(null);
      setSignaturePath('');
    }
  };

  const handleApproveCancel = () => {
    setApproveModalVisible(false);
    setApprovingPostId(null);
    setSignaturePath('');
  };

  // File upload handlers with editing support
  const handlePickImage = async () => {
    try {
      // Allow multiple image selection without cropping first
      const images = await ImagePicker.openPicker({
        multiple: true,
        mediaType: 'photo',
        quality: 0.9,
        maxWidth: 1920,
        maxHeight: 1080,
        cropping: false, // Don't crop immediately - user can edit later
      });

      if (!images || (Array.isArray(images) && images.length === 0)) {
        return;
      }

      const imageArray = Array.isArray(images) ? images : [images];

      // Process and upload images
      setUploadingFile(true);
      const uploadPromises = imageArray.map(async (img) => {
        const fileName = img.path.split('/').pop() || 'image.jpg';
        const mimeType = img.mime || 'image/jpeg';
        const uploadedFile = await uploadFileApi(img.path, fileName, mimeType);
        // Store local path for editing later
        return { ...uploadedFile, localPath: img.path } as UploadedFile & { localPath: string };
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      setSelectedFiles(prev => [...prev, ...uploadedFiles]);
      // No success alert - silent upload
    } catch (error: any) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        console.error('Error picking image:', error);
        // Silent error handling
      }
    } finally {
      setUploadingFile(false);
    }
  };

  const handlePickCamera = async () => {
    try {
      setUploadingFile(true);
      
      const image = await ImagePicker.openCamera({
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1920,
        maxHeight: 1080,
        cropping: true, // Enable cropping
        cropperToolbarTitle: 'Edit Image',
        cropperChooseText: 'Choose',
        cropperCancelText: 'Cancel',
        cropperRotateButtonsHidden: false,
        freeStyleCropEnabled: true,
        includeBase64: false,
      });

      if (!image || !image.path) {
        return;
      }

      const fileName = image.path.split('/').pop() || 'photo.jpg';
      const mimeType = image.mime || 'image/jpeg';
      const uploadedFile = await uploadFileApi(image.path, fileName, mimeType);
      // Store local path for editing later
      const fileWithPath = { ...uploadedFile, localPath: image.path } as UploadedFile & { localPath: string };
      setSelectedFiles(prev => [...prev, fileWithPath]);
      // No success alert - silent upload
    } catch (error: any) {
      if (error.code !== 'E_PICKER_CANCELLED' && error.code !== 'E_NO_CAMERA_PERMISSION') {
        console.error('Error taking photo:', error);
        Alert.alert(
          'Error',
          `Failed to take photo: ${error.message || 'Please ensure camera permission is granted'}`
        );
      }
    } finally {
      setUploadingFile(false);
    }
  };

  // Edit image with crop/rotate
  const handleEditImage = async (file: UploadedFile & { localPath?: string }, index: number) => {
    // Only allow editing if localPath exists (image not yet sent)
    const localPath = (file as any).localPath;
    if (!localPath) {
      // Image already sent, cannot edit
      Alert.alert('Info', 'Cannot edit image after sending');
      return;
    }

    await editImageWithCropRotate(localPath, async (editedImagePath: string) => {
      try {
        setUploadingFile(true);

        // Re-upload edited image
        const fileName = editedImagePath.split('/').pop() || 'edited.jpg';
        const mimeType = 'image/jpeg';
        const uploadedFile = await uploadFileApi(editedImagePath, fileName, mimeType);
        
        // Replace old file with edited one, keep localPath
        const editedFileWithPath = { 
          ...uploadedFile, 
          localPath: editedImagePath 
        } as UploadedFile & { localPath: string };
        
        setSelectedFiles(prev => prev.map((f, i) => 
          i === index ? editedFileWithPath : f
        ));
      } catch (error: any) {
        console.error('Error saving edited image:', error);
        Alert.alert('Error', 'Failed to save edited image');
      } finally {
        setUploadingFile(false);
      }
    });
  };

  // Pick document file
  const handlePickDocument = async () => {
    try {
      const [result] = await pick({
        mode: 'open',
        // Allow all file types
      });

      if (!result) {
        return;
      }

      setUploadingFile(true);
      
      // Upload document file
      const fileName = result.name || result.uri.split('/').pop() || 'document';
      const mimeType = result.type || 'application/octet-stream';
      const uploadedFile = await uploadFileApi(result.uri, fileName, mimeType);
      
      // Store local URI for viewing later
      const fileWithPath = { 
        ...uploadedFile, 
        localPath: result.uri 
      } as UploadedFile & { localPath: string };
      
      setSelectedFiles(prev => [...prev, fileWithPath]);
    } catch (error: any) {
      if (error.code !== 'E_PICKER_CANCELLED' && error.message !== 'User cancelled document picker') {
        console.error('Error picking document:', error);
        Alert.alert('Error', 'Failed to pick document');
      }
    } finally {
      setUploadingFile(false);
    }
  };

  // View document
  const handleViewDocument = async (attachment: any) => {
    try {
      let fileUri: string;
      const mimeType = attachment.mimeType || 'application/octet-stream';
      
      // If it's a Cloudinary URL, download to local first
      if (attachment.url && attachment.url.startsWith('http')) {
        // Download file to temporary directory
        const fileName = attachment.fileName || 'document';
        const fileExtension = fileName.split('.').pop() || 'pdf';
        const tempFilePath = `${RNFS.CachesDirectoryPath}/${Date.now()}_${fileName}`;
        
        // Download file
        const downloadResult = await RNFS.downloadFile({
          fromUrl: attachment.url,
          toFile: tempFilePath,
        }).promise;

        if (downloadResult.statusCode !== 200) {
          throw new Error(`Failed to download file: ${downloadResult.statusCode}`);
        }

        fileUri = `file://${tempFilePath}`;
      } else if (attachment.localPath) {
        // For local files, ensure it has file:// prefix
        fileUri = attachment.localPath.startsWith('file://') 
          ? attachment.localPath 
          : `file://${attachment.localPath}`;
      } else {
        throw new Error('No valid file URI found');
      }

      // View the document
      // viewDocument will automatically handle content:// URI conversion on Android
      await viewDocument({ 
        uri: fileUri,
        mimeType,
      });
    } catch (error: any) {
      console.error('Error viewing document:', error);
      Alert.alert(
        'Error', 
        `Failed to open document: ${error.message || 'Unknown error'}\n\nPlease install a PDF viewer app.`
      );
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Open image viewer when clicking on image
  const handleImagePress = (messageIndex: number, attachmentIndex: number) => {
    const message = messages[messageIndex];
    if (!message.attachments || message.attachments.length === 0) return;

    // Collect all images from all messages
    const allImages: Array<{ uri: string }> = [];
    let currentImageIndex = 0;

    messages.forEach((msg) => {
      if (msg.attachments && msg.attachments.length > 0) {
        msg.attachments.forEach((attachment, idx) => {
          if (attachment.mimeType.startsWith('image/')) {
            allImages.push({ uri: attachment.url });
            // Find the index of the clicked image
            if (msg.id === message.id && idx === attachmentIndex) {
              currentImageIndex = allImages.length - 1;
            }
          }
        });
      }
    });

    if (allImages.length > 0) {
      setImageViewerImages(allImages);
      setImageViewerIndex(currentImageIndex);
      setImageViewerVisible(true);
    }
  };

  const renderMessage = (message: ChatMessage, index: number) => {
    // Debug: Check attachments
    if (message.attachments && message.attachments.length > 0) {
      console.log(`Message ${index} has ${message.attachments.length} attachments:`, message.attachments);
    }
    
    // Check if message is from current user
    // Backend sends senderId as user._id (from JWT sub), compare with multiple formats
    const userId = user?.id;
    const userEmail = user?.email;
    const messageSenderId = message.senderId?.toString() || '';
    
    // Compare senderId with user.id, user._id, and user.email
    const isMyMessage = 
      messageSenderId === userId?.toString() ||
      messageSenderId === (user as any)?._id?.toString() ||
      messageSenderId === userEmail ||
      messageSenderId === 'me' ||
      userId?.toString() === messageSenderId ||
      (user as any)?._id?.toString() === messageSenderId;
    
    // Debug logging for first message
    if (index === 0) {
      console.log('=== MESSAGE OWNERSHIP DEBUG ===');
      console.log('Current user object:', JSON.stringify(user, null, 2));
      console.log('User ID:', userId);
      console.log('User _id:', (user as any)?._id);
      console.log('User email:', userEmail);
      console.log('Message senderId:', messageSenderId);
      console.log('Message senderName:', message.senderName);
      console.log('isMyMessage result:', isMyMessage);
      console.log('===============================');
    }
    
    const prevMessage = index > 0 ? messages[index - 1] : null;
    const nextMessage = index < messages.length - 1 ? messages[index + 1] : null;
    
    // Check if we should show date separator
    const showDate = index === 0 || 
      new Date(messages[index - 1].timestamp).toDateString() !== new Date(message.timestamp).toDateString();

    // Calculate time difference with next message in milliseconds
    const timeDiffWithNext = nextMessage 
      ? Math.abs(new Date(nextMessage.timestamp).getTime() - new Date(message.timestamp).getTime())
      : Infinity;

    // Check if previous message is from same sender (for name grouping)
    const isSameSenderAsPrev = prevMessage && prevMessage.senderId === message.senderId;

    // Check if next message is from same sender (for visual grouping)
    const isSameSenderAsNext = nextMessage && nextMessage.senderId === message.senderId;

    // Show sender name only if:
    // - Not my message AND
    // - Previous message is NOT from the same sender (new conversation or different person)
    const showSenderName = !isMyMessage && !isSameSenderAsPrev;
    
    // Show timestamp if:
    // - Next message is from different sender (end of this person's messages), OR
    // - Time difference with next message > 1 minute (even if same sender), OR
    // - This is the last message
    const showTimestamp = !nextMessage || !isSameSenderAsNext || timeDiffWithNext > 60000;

    // For visual grouping (reduced spacing and border radius)
    const isGroupedWithPrev = isSameSenderAsPrev && timeDiffWithNext <= 60000;
    const isGroupedWithNext = isSameSenderAsNext && timeDiffWithNext <= 60000;

    return (
      <View key={message.id}>
        {showDate && (
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>
              {new Date(message.timestamp).toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </Text>
          </View>
        )}
        
        <View style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer,
          isGroupedWithPrev && styles.groupedMessage,
          isGroupedWithNext && styles.groupedMessageNext,
        ]}>
          {showSenderName && message.senderName && (
            <Text style={styles.senderName}>{message.senderName}</Text>
          )}
          <View style={[
            styles.messageBubble,
            isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble,
            isGroupedWithPrev && (isMyMessage ? styles.myMessageGroupedTop : styles.otherMessageGroupedTop),
            isGroupedWithNext && (isMyMessage ? styles.myMessageGroupedBottom : styles.otherMessageGroupedBottom),
          ]}>
            {/* Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <View style={styles.attachmentsContainer}>
                {message.attachments.map((attachment, idx: number) => (
                  <View key={idx} style={styles.attachmentItem}>
                    {attachment.mimeType.startsWith('image/') ? (
                      <TouchableOpacity 
                        onPress={() => handleImagePress(index, idx)}
                        activeOpacity={0.8}
                      >
                        <Image 
                          source={{ uri: attachment.url }}
                          style={styles.attachmentImage}
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity 
                        onPress={() => handleViewDocument(attachment)}
                        activeOpacity={0.8}
                        style={styles.attachmentFile}
                      >
                        <FontAwesome5 name="file" size={24} color={colors.text.secondary} />
                        <Text style={styles.attachmentFileName} numberOfLines={1}>
                          {attachment.fileName}
                        </Text>
                        <Text style={styles.attachmentFileSize}>
                          {(attachment.fileSize / 1024).toFixed(1)} KB
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            )}
            
            {/* Text Content - Only show if has actual text (not placeholder like "📎 File attachment") */}
            {(() => {
              const hasAttachments = message.attachments && message.attachments.length > 0;
              const content = message.content?.trim() || '';
              const isPlaceholder = content.includes('📎') || 
                                   content.toLowerCase().includes('file attachment');
              
              // Show text only if has actual text (not placeholder)
              // If has attachments, hide placeholder text
              const shouldShowText = content && (!hasAttachments || !isPlaceholder);
              
              return shouldShowText ? (
            <Text style={[
              styles.messageText,
                  isMyMessage ? styles.myMessageText : styles.otherMessageText,
                  // If has image above, add top margin
                  hasAttachments && styles.messageTextWithImage,
            ]}>
                  {content}
            </Text>
              ) : null;
            })()}
          </View>
          {showTimestamp && (
          <Text style={[
            styles.messageTime,
            isMyMessage ? styles.myMessageTime : styles.otherMessageTime
          ]}>
            {new Date(message.timestamp).toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
          )}
        </View>
      </View>
    );
  };

  const renderChatContent = () => (
    <View style={styles.chatContent}>
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesScrollView}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome5 name="comments" size={48} color={colors.text.tertiary} />
            <Text style={styles.emptyStateText}>
              {isConnected ? t('chatDetail.noMessages') : t('chatDetail.connecting')}
            </Text>
          </View>
        ) : (
          messages.map((message, index) => renderMessage(message, index))
        )}
      </ScrollView>

      {/* Typing indicator */}
      {typingUsers.length > 0 && (
        <View style={styles.typingContainer}>
          <Text style={styles.typingText}>
            {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </Text>
        </View>
      )}

      {/* Bottom Input Area */}
      <View style={styles.inputContainer}>
        {/* Selected Files Preview */}
        {selectedFiles.length > 0 && (
          <ScrollView 
            horizontal 
            style={styles.selectedFilesContainer}
            showsHorizontalScrollIndicator={false}
          >
            {selectedFiles.map((file, index) => (
              <View key={index} style={styles.selectedFileItem}>
                {file.mimeType.startsWith('image/') ? (
                  <View>
                    <Image 
                      source={{ uri: file.url }} 
                      style={styles.selectedFileImage}
                    />
                    {/* Edit button for images - only show if has localPath (not yet sent) */}
                    {(file as any).localPath && (
                      <TouchableOpacity 
                        style={styles.editFileButton}
                        onPress={() => handleEditImage(file, index)}
                        disabled={uploadingFile}
                      >
                        <FontAwesome5 name="edit" size={12} color={colors.primary} />
                      </TouchableOpacity>
                    )}
                  </View>
                ) : (
                  <View style={styles.selectedFileDoc}>
                    <FontAwesome5 name="file" size={20} color={colors.text.secondary} />
                  </View>
                )}
                <TouchableOpacity 
                  style={styles.removeFileButton}
                  onPress={() => handleRemoveFile(index)}
                  disabled={uploadingFile}
                >
                  <FontAwesome5 name="times-circle" size={16} color={colors.danger} />
                </TouchableOpacity>
                <Text style={styles.selectedFileName} numberOfLines={1}>
                  {file.fileName}
                </Text>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Message Input Row */}
        <View style={styles.messageInputRow}>
          {/* Image Picker Buttons */}
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={handlePickImage}
            disabled={uploadingFile}
          >
            <FontAwesome5 name="image" size={18} color={colors.text.secondary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={handlePickCamera}
            disabled={uploadingFile}
          >
            <FontAwesome5 name="camera" size={18} color={colors.text.secondary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={handlePickDocument}
            disabled={uploadingFile}
          >
            <FontAwesome5 name="file" size={18} color={colors.text.secondary} />
          </TouchableOpacity>
          
          {uploadingFile && (
            <ActivityIndicator size="small" color={colors.primary} style={{ marginLeft: spacing.xs }} />
          )}
          
          <TextInput
            style={styles.messageInput}
            placeholder={t('chatDetail.typeMessage')}
            placeholderTextColor={colors.text.tertiary}
            value={inputText}
            onChangeText={handleInputChange}
            multiline
            editable={isConnected && !uploadingFile}
          />

          <TouchableOpacity 
            style={styles.sendButton}
            onPress={handleSendMessage}
            disabled={(!inputText.trim() && selectedFiles.length === 0) || !isConnected || uploadingFile}
          >
            <FontAwesome5 
              name="paper-plane" 
              size={18} 
              color={(inputText.trim() || selectedFiles.length > 0) && isConnected && !uploadingFile ? colors.primary : colors.text.tertiary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderTopicPost = (post: TopicPost, index: number) => {
    const isMyPost = post.authorId === user?.id || post.authorId === (user as any)?._id?.toString();
    const isAdmin = user?.role === 'ADMIN';

    // Get previous post for grouping
    const prevPost = index > 0 ? topicPosts[index - 1] : null;
    const isSameSenderAsPrev = prevPost && prevPost.authorId === post.authorId;
    
    // Show sender name only if not my post and different sender from previous
    const showSenderName = !isMyPost && !isSameSenderAsPrev;
    
    // Show timestamp
    const showTimestamp = true;

    return (
      <View key={post.id}>
        <View style={[
          styles.messageContainer,
          isMyPost ? styles.myMessageContainer : styles.otherMessageContainer,
        ]}>
          {showSenderName && (
            <Text style={styles.senderName}>{post.authorName}</Text>
          )}
          <View style={[
            styles.messageBubbleWrapper,
            isMyPost ? styles.myMessageBubbleWrapper : styles.otherMessageBubbleWrapper,
          ]}>
            {/* Approved icon - bên trái nếu là tin nhắn của mình */}
            {post.approved && isMyPost && (
              <View style={styles.approvedIconWithSignature}>
                <View style={styles.approvedIconContainer}>
                  <FontAwesome5 
                    name="check-circle" 
                    size={16} 
                    color={colors.status.onSchedule || '#4CAF50'} 
                    solid 
                  />
                </View>
                {/* Approval Signature - bên cạnh icon */}
                {post.approvalSignature && (
                  <View style={styles.signatureContainer}>
                    <Svg width={40} height={40}>
                      <Path
                        d={post.approvalSignature}
                        stroke={colors.text.secondary}
                        strokeWidth="1.5"
                        fill="none"
                      />
                    </Svg>
                  </View>
                )}
              </View>
            )}
            <TouchableOpacity
              onLongPress={() => {
                if (isAdmin && !post.approved) {
                  handleTopicApprove(post.id);
                }
              }}
              activeOpacity={isAdmin && !post.approved ? 0.7 : 1}
            >
              <View style={[
                styles.messageBubble,
                isMyPost ? styles.myMessageBubble : styles.otherMessageBubble,
                {
                  borderWidth: 2,
                  borderColor: getTopicStyle(post.category).button.borderColor,
                },
              ]}>
                {/* Attachments */}
                {post.attachments && post.attachments.length > 0 && (
                  <View style={styles.attachmentsContainer}>
                    {post.attachments.map((attachment, idx: number) => (
                      <View key={idx} style={styles.attachmentItem}>
                        {attachment.mimeType.startsWith('image/') ? (
                          <TouchableOpacity 
                            onPress={() => {
                              // Collect all images from all topic posts
                              const allImages: Array<{ uri: string }> = [];
                              let currentImageIndex = 0;
                              topicPosts.forEach((p) => {
                                if (p.attachments && p.attachments.length > 0) {
                                  p.attachments.forEach((att, attIdx) => {
                                    if (att.mimeType.startsWith('image/')) {
                                      allImages.push({ uri: att.url });
                                      if (p.id === post.id && attIdx === idx) {
                                        currentImageIndex = allImages.length - 1;
                                      }
                                    }
                                  });
                                }
                              });
                              if (allImages.length > 0) {
                                setImageViewerImages(allImages);
                                setImageViewerIndex(currentImageIndex);
                                setImageViewerVisible(true);
                              }
                            }}
                            activeOpacity={0.8}
                          >
                            <Image 
                              source={{ uri: attachment.url }}
                              style={styles.attachmentImage}
                              resizeMode="cover"
                            />
            </TouchableOpacity>
                        ) : (
                          <TouchableOpacity 
                            onPress={() => handleViewDocument(attachment)}
                            activeOpacity={0.8}
                            style={styles.attachmentFile}
                          >
                            <FontAwesome5 name="file" size={24} color={colors.text.secondary} />
                            <Text style={styles.attachmentFileName} numberOfLines={1}>
                              {attachment.fileName}
                            </Text>
                            <Text style={styles.attachmentFileSize}>
                              {(attachment.fileSize / 1024).toFixed(1)} KB
                            </Text>
                          </TouchableOpacity>
                        )}
          </View>
                    ))}
                  </View>
                )}
                
                {/* Post Content - Only show if has actual text (not placeholder) */}
                {(() => {
                  const hasAttachments = post.attachments && post.attachments.length > 0;
                  const content = post.content?.trim() || '';
                  const isPlaceholder = content.includes('📎') || 
                                       content.toLowerCase().includes('file attachment');
                  
                  const shouldShowText = content && (!hasAttachments || !isPlaceholder);
                  
                  return shouldShowText ? (
                    <Text style={[
                      styles.messageText,
                      isMyPost ? styles.myMessageText : styles.otherMessageText,
                      hasAttachments && styles.messageTextWithImage,
                    ]}>
                      {content}
                    </Text>
                  ) : null;
                })()}
          </View>
          </TouchableOpacity>
            {/* Approved icon - bên phải nếu là tin nhắn của người khác */}
            {post.approved && !isMyPost && (
              <View style={styles.approvedIconWithSignature}>
                <View style={styles.approvedIconContainer}>
                  <FontAwesome5 
                    name="check-circle" 
                    size={16} 
                    color={colors.status.onSchedule || '#4CAF50'} 
                    solid 
                  />
                </View>
                {/* Approval Signature - bên cạnh icon */}
                {post.approvalSignature && (
                  <View style={styles.signatureContainer}>
                    <Svg width={40} height={40}>
                      <Path
                        d={post.approvalSignature}
                        stroke={colors.text.secondary}
                        strokeWidth="1.5"
                        fill="none"
                      />
                    </Svg>
                  </View>
                )}
              </View>
            )}
        </View>

          {showTimestamp && (
            <Text style={[
              styles.messageTime,
              isMyPost ? styles.myMessageTime : styles.otherMessageTime
            ]}>
              {new Date(post.timestamp).toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          )}
        </View>

        {/* Comments */}
        {post.comments.map((comment) => {
          const isMyComment = comment.authorId === user?.id || comment.authorId === (user as any)?._id?.toString();
          return (
            <View 
              key={comment.id}
              style={[
                styles.messageContainer,
                isMyComment ? styles.myMessageContainer : styles.otherMessageContainer,
                { marginLeft: spacing.lg, marginTop: spacing.xs }
              ]}
            >
              {!isMyComment && (
                <Text style={styles.senderName}>{comment.authorName}</Text>
              )}
              <View style={[
                styles.messageBubble,
                isMyComment ? styles.myMessageBubble : styles.otherMessageBubble,
                styles.commentBubble,
              ]}>
                <Text style={[
                  styles.messageText,
                  isMyComment ? styles.myMessageText : styles.otherMessageText,
                ]}>
                  {comment.content}
                </Text>
                <Text style={[
                  styles.messageTime,
                  isMyComment ? styles.myMessageTime : styles.otherMessageTime,
                  { marginTop: spacing.xs }
                ]}>
                  {new Date(comment.timestamp).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
        </View>
            </View>
          );
        })}
      </View>
    );
  };

  const renderTopicContent = () => (
    <View style={styles.topicContent}>
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {topicPosts.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome5 name="clipboard-list" size={48} color={colors.text.tertiary} />
            <Text style={styles.emptyStateText}>
              {isConnected ? t('chatDetail.noTopics') : t('chatDetail.connecting')}
            </Text>
        </View>
        ) : (
          topicPosts.map((post, index) => renderTopicPost(post, index))
        )}
      </ScrollView>

      {/* Bottom row: topic selector + disabled input */}
      <View style={styles.topicBottomBar}>
        <View style={styles.topicButtonsRow}>
          {TOPIC_CATEGORY_KEYS.map((cat) => {
            const isSelected = selectedTopic === cat;
            const topicStyle = getTopicStyle(cat);
            return (
            <TouchableOpacity
              key={cat}
                style={[
                  styles.topicButton, 
                  topicStyle.button,
                  isSelected && [
                    styles.topicButtonSelected,
                    { borderColor: topicStyle.button.borderColor },
                  ],
                ]}
              onPress={() => {
                setSelectedTopic(cat);
                // Stay on topic screen; do not navigate to chat
              }}
            >
                <Text style={[
                  styles.topicButtonText, 
                  topicStyle.buttonText,
                  isSelected && styles.topicButtonTextSelected,
                ]}>
                {t(`chatDetail.${cat}`)}
              </Text>
            </TouchableOpacity>
            );
          })}
        </View>

        {selectedTopic ? (
          <View>
            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
              <ScrollView 
                horizontal 
                style={styles.selectedFilesContainer}
                showsHorizontalScrollIndicator={false}
              >
                {selectedFiles.map((file, index) => (
                  <View key={index} style={styles.selectedFileItem}>
                    {file.mimeType.startsWith('image/') ? (
                      <View>
                        <Image 
                          source={{ uri: file.url }} 
                          style={styles.selectedFileImage}
                        />
                        {/* Edit button for images - only show if has localPath (not yet sent) */}
                        {(file as any).localPath && (
                          <TouchableOpacity 
                            style={styles.editFileButton}
                            onPress={() => handleEditImage(file, index)}
                            disabled={uploadingFile}
                          >
                            <FontAwesome5 name="edit" size={12} color={colors.primary} />
                          </TouchableOpacity>
                        )}
                      </View>
                    ) : (
                      <View style={styles.selectedFileDoc}>
                        <FontAwesome5 name="file" size={20} color={colors.text.secondary} />
                      </View>
                    )}
                    <TouchableOpacity
                      style={styles.removeFileButton}
                      onPress={() => handleRemoveFile(index)}
                      disabled={uploadingFile}
                    >
                      <FontAwesome5 name="times-circle" size={16} color={colors.danger} solid />
                    </TouchableOpacity>
                    {file.mimeType.startsWith('image/') ? null : (
                      <Text style={styles.selectedFileName} numberOfLines={1}>
                        {file.fileName}
              </Text>
                    )}
            </View>
                ))}
              </ScrollView>
            )}

            <View style={styles.messageInputRow}>
              {/* Image Picker Buttons */}
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={handlePickImage}
                disabled={uploadingFile || !isConnected}
              >
                <FontAwesome5 name="image" size={18} color={colors.text.secondary} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={handlePickCamera}
                disabled={uploadingFile || !isConnected}
              >
                <FontAwesome5 name="camera" size={18} color={colors.text.secondary} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={handlePickDocument}
                disabled={uploadingFile || !isConnected}
              >
                <FontAwesome5 name="file" size={18} color={colors.text.secondary} />
              </TouchableOpacity>
              
              {uploadingFile && (
                <ActivityIndicator size="small" color={colors.primary} style={{ marginLeft: spacing.xs }} />
              )}

            <TextInput
                style={styles.messageInput}
              placeholder={t('chatDetail.typeMessage')}
              placeholderTextColor={colors.text.tertiary}
              value={inputText}
                onChangeText={handleInputChange}
              multiline
                editable={isConnected}
            />
            <TouchableOpacity 
              style={styles.sendButton}
              onPress={handleSendMessage}
                disabled={(!inputText.trim() && selectedFiles.length === 0) || !isConnected}
            >
              <FontAwesome5 
                name="paper-plane" 
                size={18} 
                  color={(inputText.trim() || selectedFiles.length > 0) && isConnected ? colors.primary : colors.text.tertiary} 
              />
            </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.disabledInputRow}>
            <View style={styles.disabledInput}>
              <Text style={styles.disabledPlaceholder}>{t('chatDetail.chooseTopicFirst')}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );

  // Breadcrumb for "Chat > [ChatName]" style (uses default simple path)
  const breadcrumbItems = generateBreadcrumbItems(
    'chatDetail',
    (navigationStack as any[]) || [],
    { chatName },
    onGoBack,
    onNavigateToScreen as any
  );

  return (
    <View style={styles.container}>
      {/* Main Chat Content */}
      <Animated.View 
        style={[
          styles.mainContent,
          { transform: [{ translateX }] }
        ]}
      >
        <Animated.View style={{ flex: 1 }} {...panResponder.panHandlers}>
    <MainLayout
      onProfilePress={() => {}}
      onChatPress={() => {}}
      onNotificationPress={() => {}}
      notificationCount={1}
    >
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xs }}>
        <Breadcrumb items={breadcrumbItems} />
      </View>
      <KeyboardAvoidingView 
                style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'topic' && styles.activeTab]}
            onPress={() => setActiveTab('topic')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'topic' && styles.activeTabText
            ]}>
              {t('chatDetail.topic')}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.tabDivider} />
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'chat' && styles.activeTab]}
            onPress={() => setActiveTab('chat')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'chat' && styles.activeTabText
            ]}>
              {t('chatDetail.chat')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {activeTab === 'chat' ? renderChatContent() : renderTopicContent()}
      </KeyboardAvoidingView>
    </MainLayout>
        </Animated.View>
      </Animated.View>

      {/* Side Panels */}
      {showConfig && (
        <View style={styles.sidePanel}>
          <ConfigScreen
            chatName={chatName}
            onClose={handleCloseSidePanels}
            onAddUser={(email) => {
              console.log('Add user:', email);
            }}
            onRenameGroup={(newName) => {
              console.log('Rename group:', newName);
            }}
          />
        </View>
      )}

      {showMedia && (
        <View style={styles.sidePanel}>
          <MediaScreen onClose={handleCloseSidePanels} />
        </View>
      )}

      {/* Approve Modal */}
      <ApproveModal
        visible={approveModalVisible}
        onConfirm={handleApproveConfirm}
        onCancel={handleApproveCancel}
        signaturePath={signaturePath}
        setSignaturePath={setSignaturePath}
        signaturePadWidth={signaturePadWidth}
        signaturePadHeight={signaturePadHeight}
        colors={colors}
        spacing={spacing}
        typography={typography}
        t={t}
      />

      {/* Image Viewer Modal */}
      <ImageViewing
        images={imageViewerImages}
        imageIndex={imageViewerIndex}
        visible={imageViewerVisible}
        onRequestClose={() => setImageViewerVisible(false)}
        presentationStyle="overFullScreen"
        animationType="fade"
        doubleTapToZoomEnabled={true}
        swipeToCloseEnabled={true}
      />


    </View>
  );
}

// Approve Modal Component with Signature Pad
interface ApproveModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  signaturePath: string;
  setSignaturePath: (path: string) => void;
  signaturePadWidth: number;
  signaturePadHeight: number;
  colors: any;
  spacing: any;
  typography: any;
  t: any;
}

const ApproveModal: React.FC<ApproveModalProps> = ({
  visible,
  onConfirm,
  onCancel,
  signaturePath,
  setSignaturePath,
  signaturePadWidth,
  signaturePadHeight,
  colors,
  spacing,
  typography,
}) => {
  const [currentPath, setCurrentPath] = useState<string>('');
  const [isDrawing, setIsDrawing] = useState(false);
  const localSignatureRef = useRef<string>('');

  useEffect(() => {
    localSignatureRef.current = signaturePath;
  }, [signaturePath]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (e) => {
      setIsDrawing(true);
      const { locationX, locationY } = e.nativeEvent;
      const newPath = `M${locationX},${locationY}`;
      setCurrentPath(newPath);
    },
    onPanResponderMove: (e) => {
      if (isDrawing) {
        const { locationX, locationY } = e.nativeEvent;
        setCurrentPath(prev => `${prev} L${locationX},${locationY}`);
      }
    },
    onPanResponderRelease: () => {
      setIsDrawing(false);
      const newSignature = localSignatureRef.current + (localSignatureRef.current ? ' ' : '') + currentPath;
      setSignaturePath(newSignature);
      localSignatureRef.current = newSignature;
      setCurrentPath('');
    },
  });

  const handleClear = () => {
    setSignaturePath('');
    setCurrentPath('');
    localSignatureRef.current = '';
  };

  const handleConfirm = () => {
    const finalPath = signaturePath + (currentPath ? (signaturePath ? ' ' : '') + currentPath : '');
    if (finalPath.trim()) {
      onConfirm();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.lg,
      }}>
        <View style={{
          backgroundColor: colors.cardBackground,
          borderRadius: spacing.borderRadius.large,
          padding: spacing.lg,
          width: '90%',
          maxWidth: 400,
        }}>
          <Text style={{
            ...typography.styles.heading3,
            marginBottom: spacing.md,
            color: colors.text.primary,
          }}>
            Approve Post
          </Text>

          <Text style={{
            ...typography.styles.textMedium,
            marginBottom: spacing.md,
            color: colors.text.secondary,
          }}>
            Please sign your approval:
          </Text>

          {/* Signature Pad */}
          <View style={{
            borderWidth: 2,
            borderColor: colors.divider,
            borderRadius: spacing.borderRadius.medium,
            marginBottom: spacing.md,
            overflow: 'hidden',
            backgroundColor: '#FFFFFF',
          }}>
            <View {...panResponder.panHandlers}>
              <Svg
                width={signaturePadWidth}
                height={signaturePadHeight}
              >
                {signaturePath && (
                  <Path
                    d={signaturePath}
                    stroke={colors.primary}
                    strokeWidth="2"
                    fill="none"
                  />
                )}
                {currentPath && (
                  <Path
                    d={currentPath}
                    stroke={colors.primary}
                    strokeWidth="2"
                    fill="none"
                  />
                )}
              </Svg>
            </View>
          </View>

          {/* Buttons */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: spacing.sm,
          }}>
            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: spacing.sm,
                borderRadius: spacing.borderRadius.medium,
                backgroundColor: colors.neutral,
                alignItems: 'center',
              }}
              onPress={handleClear}
            >
              <Text style={{
                ...typography.styles.textMedium,
                color: colors.text.primary,
              }}>
                Clear
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: spacing.sm,
                borderRadius: spacing.borderRadius.medium,
                backgroundColor: colors.divider,
                alignItems: 'center',
              }}
              onPress={onCancel}
            >
              <Text style={{
                ...typography.styles.textMedium,
                color: colors.text.secondary,
              }}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: spacing.sm,
                borderRadius: spacing.borderRadius.medium,
                backgroundColor: signaturePath.trim() ? colors.primary : colors.divider,
                alignItems: 'center',
              }}
              onPress={handleConfirm}
              disabled={!signaturePath.trim()}
            >
              <Text style={{
                ...typography.styles.textMedium,
                color: signaturePath.trim() ? '#FFFFFF' : colors.text.secondary,
              }}>
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mainContent: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  sidePanel: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    backgroundColor: colors.background,
    zIndex: 1000,
  },
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  tab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  activeTab: {
    // Optional: add background or border for active tab
  },
  tabText: {
    ...typography.styles.textMedium,
    fontSize: 17,
    color: colors.text.secondary,
    fontWeight: '400',
  },
  activeTabText: {
    ...typography.styles.textMedium,
    fontSize: 17,
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  tabDivider: {
    width: 1,
    height: 16,
    backgroundColor: colors.divider,
    marginHorizontal: spacing.sm,
  },
  chatContent: {
    flex: 1,
  },
  topicChipRow: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  topicChip: {
    alignSelf: 'flex-start',
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  topicChipText: {
    ...typography.styles.textSmall,
    fontSize: 13,
  },
  topicMessageWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  topicBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingTop: spacing.xs,
  },
  topicBadge: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  topicBadgeText: {
    ...typography.styles.textSmall,
    fontSize: 11,
    fontWeight: '600',
  },
  approvedBadge: {
    marginLeft: spacing.xs,
  },
  topicPostActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: spacing.md,
  },
  topicActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  topicActionText: {
    ...typography.styles.textSmall,
    fontSize: 11,
    color: colors.text.secondary,
  },
  commentBubble: {
    maxWidth: '85%',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  messagesScrollView: {
    flex: 1,
  },
  messagesContainer: {
    paddingHorizontal: spacing.xs,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  dateContainer: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  dateText: {
    ...typography.styles.textSmall,
    fontSize: 13,
    color: colors.text.tertiary,
    backgroundColor: colors.cardBackground,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.borderRadius.small,
  },
  messageContainer: {
    marginBottom: spacing.md,
  },
  myMessageContainer: {
    alignItems: 'flex-end',
  },
  otherMessageContainer: {
    alignItems: 'flex-start',
  },
  groupedMessage: {
    marginBottom: spacing.xs, // Reduced spacing for grouped messages
  },
  groupedMessageNext: {
    marginBottom: spacing.xs, // Reduced spacing when there's a next grouped message
  },
  senderName: {
    ...typography.styles.textSmall,
    fontSize: 13,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
  },
  messageBubbleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  myMessageBubbleWrapper: {
    justifyContent: 'flex-end',
  },
  otherMessageBubbleWrapper: {
    justifyContent: 'flex-start',
  },
  approvedIconWithSignature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.xs,
  },
  approvedIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  signatureContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: spacing.borderRadius.small,
    padding: 4,
    marginLeft: spacing.xs,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1,
  },
  messageBubble: {
    maxWidth: '100%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.borderRadius.large,
  },
  myMessageBubble: {
    backgroundColor: colors.primary, // Màu xanh cho tin nhắn của mình
    borderBottomRightRadius: spacing.borderRadius.small,
    alignSelf: 'flex-end', // Đặt bên phải
  },
  otherMessageBubble: {
    backgroundColor: colors.cardBackground, // Màu xám cho tin nhắn người khác
    borderBottomLeftRadius: spacing.borderRadius.small,
    alignSelf: 'flex-start', // Đặt bên trái
  },
  // Grouped message styles - reduce border radius for messages in the middle of a group
  myMessageGroupedTop: {
    borderTopRightRadius: spacing.borderRadius.small,
  },
  myMessageGroupedBottom: {
    borderBottomRightRadius: spacing.borderRadius.small,
  },
  otherMessageGroupedTop: {
    borderTopLeftRadius: spacing.borderRadius.small,
  },
  otherMessageGroupedBottom: {
    borderBottomLeftRadius: spacing.borderRadius.small,
  },
  messageText: {
    ...typography.styles.textMedium,
    fontSize: 15,
    lineHeight: 22,
  },
  myMessageText: {
    color: colors.text.white,
  },
  otherMessageText: {
    color: colors.text.primary,
  },
  attachmentsContainer: {
    marginBottom: spacing.xs,
  },
  attachmentItem: {
    marginBottom: spacing.xs,
  },
  attachmentImage: {
    // Small thumbnail size
    width: 150,
    height: 150,
    borderRadius: spacing.borderRadius.medium,
  },
  messageTextWithImage: {
    // Add margin top when text is below image
    marginTop: spacing.sm,
  },
  attachmentFile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    backgroundColor: colors.background + '40',
    borderRadius: spacing.borderRadius.small,
    minWidth: 200,
  },
  attachmentFileName: {
    ...typography.styles.textMedium,
    fontSize: 14,
    color: colors.text.primary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  attachmentFileSize: {
    ...typography.styles.textSmall,
    fontSize: 11,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  messageTime: {
    ...typography.styles.textSmall,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  myMessageTime: {
    color: colors.text.tertiary,
    textAlign: 'right',
  },
  otherMessageTime: {
    color: colors.text.tertiary,
    textAlign: 'left',
    marginLeft: spacing.xs,
  },
  inputContainer: {
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? spacing.lg : spacing.sm,
  },
  messageInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  iconButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.xs,
  },
  selectedFilesContainer: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  selectedFileItem: {
    marginRight: spacing.md,
    alignItems: 'center',
    width: 80,
  },
  selectedFileImage: {
    width: 60,
    height: 60,
    borderRadius: spacing.borderRadius.small,
    backgroundColor: colors.divider,
  },
  selectedFileDoc: {
    width: 60,
    height: 60,
    borderRadius: spacing.borderRadius.small,
    backgroundColor: colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.divider,
  },
  removeFileButton: {
    position: 'absolute',
    top: -5,
    right: 5,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  editFileButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  selectedFileName: {
    ...typography.styles.textSmall,
    fontSize: 10,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  messageInput: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.borderRadius.medium,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxHeight: 100,
    ...typography.styles.textMedium,
    fontSize: 15,
    color: colors.text.primary,
  },
  sendButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  topicContent: {
    flex: 1,
    paddingHorizontal: spacing.xs,
  },
  postCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.borderRadius.medium,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    ...typography.styles.textSmall,
    color: colors.text.white,
    fontWeight: 'bold',
  },
  postHeaderInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  postAuthor: {
    ...typography.styles.textMedium,
    fontSize: 15,
    color: colors.text.primary,
  },
  postTime: {
    ...typography.styles.textSmall,
    fontSize: 12,
    color: colors.text.secondary,
  },
  postBody: {
    marginTop: spacing.md,
  },
  postContent: {
    ...typography.styles.textMedium,
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.primary,
  },
  postActions: {
    flexDirection: 'row',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  actionText: {
    ...typography.styles.textSmall,
    fontSize: 14,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  mockImageRow: {
    height: 120,
    borderRadius: spacing.borderRadius.small,
    backgroundColor: colors.overlay.light,
  },
  typingContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },
  typingText: {
    ...typography.styles.textSmall,
    fontSize: 12,
    color: colors.text.tertiary,
    fontStyle: 'italic',
  },
  commentBubbleLeft: {
    alignSelf: 'flex-start',
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.borderRadius.medium,
    padding: spacing.md,
    marginBottom: spacing.sm,
    maxWidth: '80%',
  },
  commentBubbleRight: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius.medium,
    padding: spacing.md,
    marginBottom: spacing.md,
    maxWidth: '80%',
  },
  commentAuthor: {
    ...typography.styles.textSmall,
    fontSize: 13,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  commentText: {
    ...typography.styles.textMedium,
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.primary,
  },
  commentTextRight: {
    ...typography.styles.textMedium,
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.white,
  },
  commentTime: {
    ...typography.styles.textSmall,
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  commentTimeRight: {
    ...typography.styles.textSmall,
    fontSize: 12,
    color: colors.text.white,
    marginTop: spacing.xs,
    textAlign: 'right',
  },
  topicBottomBar: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    // backgroundColor: colors.background,
  },
  topicButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  topicButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
    borderRadius: spacing.borderRadius.small,
    alignItems: 'center',
  },
  topicButtonSelected: {
    borderWidth: 2,
    transform: [{ scale: 1.05 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  topicButtonText: {
    ...typography.styles.textSmall,
    fontSize: 13,
  },
  topicButtonTextSelected: {
    fontWeight: 'bold',
  },
  disabledInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  disabledInput: {
    flex: 1,
    height: 44,
    borderRadius: spacing.borderRadius.medium,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.divider,
  },
  disabledPlaceholder: {
    ...typography.styles.textMedium,
    fontSize: 15,
    color: colors.text.secondary,
  },
  selectedTopicBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  selectedTopicBadgeText: {
    ...typography.styles.textSmall,
    fontSize: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xs,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing.xl * 3,
  },
  emptyStateText: {
    ...typography.styles.textMedium,
    fontSize: 16,
    color: colors.text.tertiary,
    marginTop: spacing.lg,
  },
});


