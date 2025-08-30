import { 
  Atom, BookOpen, Calculator, CalendarDays, DollarSign, GraduationCap, Languages, 
  MapPin, Music, Palette, Star, Users, Wifi, Search, Filter, Heart, MessageSquare, 
  Briefcase, Clock, ChevronDown, Check, Menu, X, UserCircle2, Settings, LogOut, 
  Moon, Sun, MonitorSmartphone, Globe, ExternalLink, ThumbsUp, Brain, BookMarked, UsersRound, Lightbulb
} from 'lucide-react';

export const Icons = {
  atom: Atom,
  bookOpen: BookOpen,
  calculator: Calculator,
  calendarDays: CalendarDays,
  dollarSign: DollarSign,
  graduationCap: GraduationCap,
  languages: Languages,
  mapPin: MapPin,
  music: Music,
  palette: Palette,
  star: Star,
  users: Users,
  wifi: Wifi,
  search: Search,
  filter: Filter,
  heart: Heart,
  heartFilled: (props: React.ComponentProps<typeof Heart>) => <Heart {...props} fill="currentColor" />,
  messageSquare: MessageSquare,
  briefcase: Briefcase,
  clock: Clock,
  chevronDown: ChevronDown,
  check: Check,
  menu: Menu,
  x: X,
  profile: UserCircle2,
  settings: Settings,
  logout: LogOut,
  moon: Moon,
  sun: Sun,
  responsive: MonitorSmartphone,
  globe: Globe,
  externalLink: ExternalLink,
  thumbsUp: ThumbsUp,
  brain: Brain,
  bookMarked: BookMarked,
  usersRound: UsersRound,
  lightbulb: Lightbulb
};

export const SubjectIcons: Record<string, React.ElementType> = {
  Mathematics: Icons.calculator,
  Physics: Icons.atom,
  Chemistry: Icons.atom, // Could use a specific chemistry icon if available or custom
  Biology: Icons.atom, // Could use a specific biology icon if available or custom
  English: Icons.bookOpen,
  French: Icons.languages,
  German: Icons.languages,
  History: Icons.bookOpen, // Or a scroll icon
  "Computer Science": Icons.graduationCap, // Or a code icon
  "Music Theory": Icons.music,
  "Art History": Icons.palette,
  Economics: Icons.dollarSign, // Or a graph icon
  Geography: Icons.globe,
  Default: Icons.graduationCap,
};

export const LocationIcons = {
  Online: Icons.wifi,
  InPerson: Icons.users,
  Both: Icons.responsive
};