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
  id: string
  expiration_timestamp?: string
  origin: Origin
}

export interface Origin {
  type: string
}

export interface Pricing {
  billable: boolean
  pricing_model: string
  category: string
}


export interface Status {
  id: string
  status: string
  timestamp: string
  recipient_id: string
  conversation?: Conversation
  pricing?: Pricing
}

export interface Value {
  messaging_product: string;
  metadata: Metadata;
  contacts?: Contact[];
  messages?: Message[];
  statuses?: Status[]

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
  text?: Text;
  reaction?: Reaction;
  image?: Image;

  type: string;
}

export interface Text {
  body: string;
}
export interface Reaction {
  message_id: string
  emoji: string
}
export interface Image {
  caption: string
  mime_type: string
  sha256: string
  id: string
}