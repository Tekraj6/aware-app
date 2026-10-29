import React from 'react';
import {
  Eye,
  Glasses,
  Lock,
  HelpCircle,
  MessageSquare,
  MessageCircle,
  Users,
  UserCheck,
  Heart,
  HeartHandshake,
  GraduationCap,
  Briefcase,
  User,
  Sparkles,
  BookOpen,
  Lightbulb,
  Home,
  Library,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  X,
  Pencil,
  Trash2,
  Camera,
  Moon,
  Download,
  AlertTriangle,
  CheckCircle2,
  Info,
  FileText,
  FileCode,
  Mail,
  Share2,
  ExternalLink,
  LucideProps,
} from 'lucide-react';

interface IconProps extends LucideProps {
  name: string;
}

export default function Icon({ name, size = 20, color = 'currentColor', className, ...props }: IconProps) {
  const iconProps = { size, color, className, ...props };

  switch (name) {
    case 'eye':
      return <Eye {...iconProps} />;
    case 'glasses':
      return <Glasses {...iconProps} />;
    case 'lock-closed':
    case 'lock':
      return <Lock {...iconProps} />;
    case 'help-circle':
      return <HelpCircle {...iconProps} />;
    case 'chatbubble-outline':
    case 'chatbubbles':
    case 'chatbubble-ellipses-outline':
      return <MessageSquare {...iconProps} />;
    case 'people':
    case 'users':
      return <Users {...iconProps} />;
    case 'people-outline':
    case 'user-check':
      return <UserCheck {...iconProps} />;
    case 'heart':
      return <Heart {...iconProps} />;
    case 'heart-outline':
    case 'heart-handshake':
      return <HeartHandshake {...iconProps} />;
    case 'school':
    case 'graduation-cap':
      return <GraduationCap {...iconProps} />;
    case 'briefcase':
      return <Briefcase {...iconProps} />;
    case 'person':
    case 'person-outline':
    case 'user':
      return <User {...iconProps} />;
    case 'sparkles':
      return <Sparkles {...iconProps} />;
    case 'journal':
    case 'journal-outline':
      return <BookOpen {...iconProps} />;
    case 'bulb':
    case 'bulb-outline':
      return <Lightbulb {...iconProps} />;
    case 'home':
    case 'home-outline':
      return <Home {...iconProps} />;
    case 'library':
    case 'library-outline':
      return <Library {...iconProps} />;
    case 'chevron-forward':
      return <ChevronRight {...iconProps} />;
    case 'chevron-down':
      return <ChevronDown {...iconProps} />;
    case 'chevron-up':
      return <ChevronUp {...iconProps} />;
    case 'arrow-back':
      return <ArrowLeft {...iconProps} />;
    case 'close':
      return <X {...iconProps} />;
    case 'pencil':
      return <Pencil {...iconProps} />;
    case 'trash-outline':
    case 'trash':
      return <Trash2 {...iconProps} />;
    case 'camera':
      return <Camera {...iconProps} />;
    case 'moon':
      return <Moon {...iconProps} />;
    case 'download-outline':
    case 'download':
      return <Download {...iconProps} />;
    case 'warning-outline':
    case 'warning':
      return <AlertTriangle {...iconProps} />;
    case 'checkmark-circle':
      return <CheckCircle2 {...iconProps} />;
    case 'information-circle':
      return <Info {...iconProps} />;
    case 'pdf':
    case 'file-text':
      return <FileText {...iconProps} />;
    case 'json':
    case 'file-code':
      return <FileCode {...iconProps} />;
    case 'mail':
      return <Mail {...iconProps} />;
    case 'share':
    case 'share-outline':
      return <Share2 {...iconProps} />;
    case 'open':
    case 'external-link':
      return <ExternalLink {...iconProps} />;
    default:
      return <HelpCircle {...iconProps} />;
  }
}
