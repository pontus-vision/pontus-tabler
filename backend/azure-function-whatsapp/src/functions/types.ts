export interface WhatsappWebHook {
  object: string;
  entry: Entry[];
}

export interface Entry {
  id: string;
  changes: Change[];
}

export interface Change {
  value: Value;
  field: string;
}

export interface Conversation {
  id: string;
  expiration_timestamp?: string;
  origin: Origin;
}

export interface Origin {
  type: string;
}

export interface Pricing {
  billable: boolean;
  pricing_model: string;
  category: string;
}

export interface Status {
  id: string;
  status: string;
  timestamp: string;
  recipient_id: string;
  conversation?: Conversation;
  pricing?: Pricing;
}

export interface Value {
  messaging_product: string;
  metadata: Metadata;
  contacts?: Contact[];
  messages?: Message[];
  statuses?: Status[];
}

export interface Metadata {
  display_phone_number: string;
  phone_number_id: string;
}

export interface Contact {
  profile: Profile;
  wa_id: string;
}

export interface Profile {
  name: string;
}

export interface Message {
  from: string;
  id: string;
  timestamp: string;
  audio?: Audio;
  text?: Text;
  reaction?: Reaction;
  image?: Image;

  type: string;
}

export interface Text {
  body: string;
}
export interface Reaction {
  message_id: string;
  emoji: string;
}
export interface Image {
  caption: string;
  mime_type: string;
  sha256: string;
  id: string;
}

export interface Audio {
  mime_type: string;
  sha256: string;
  id: string;
  voice: boolean;
}

export type RoleType = 'user' | 'assistant' | 'system' | 'function';

export interface OpenAIMessage {
  role: RoleType;
  content: string;
}

export type Features =
  | '24-hour porter'
  | '24-hour concierge'
  | 'convenience store'
  | 'fast internet'
  | 'air conditioner'
  | 'heated floor'
  | 'solar panels'
  | 'ground pump'
  | 'modern'
  | 'ensuite'
  | 'luxurious';

export type RoomTypes =
  | 'bedroom'
  | 'bathroom'
  | 'outside kitchen'
  | 'kitchen'
  | 'utility'
  | 'patio'
  | 'garden'
  | 'diningroom'
  | 'balcony'
  | 'livingroom'
  | 'library'
  | 'gym'
  | 'office'
  | 'toilet'
  | 'walk-in closet'
  | 'garage'
  | 'playground'
  | 'other'
  | 'swimming pool'
  | 'sauna';

export type PropertyTypes =
  | 'building'
  | 'house'
  | 'flat'
  | 'penthouse'
  | 'whole-floor apartment'
  | 'castle'
  | 'maizonette'
  | 'studio'
  | 'barn conversion'
  | 'garage'
  | 'commercial';
export interface CommonData {
  areaSqMeter?: number;
  areaSqFeet?: number;
  descripton?: string;
  short_description?: string;
  features?: Features[];
  url?: string;
}

export interface Room extends CommonData {
  kind: RoomTypes;
}
export interface Property extends CommonData {
  latitude?: number;
  longitude?: number;
  distance?: number;
  name?: string;
  address?: string;
  kind: PropertyTypes[];
  rooms?: Room[];
  flats?: Property[];
  communalAreas?: Room[];
  floors?: number;
  floorNumber?: number;
}
