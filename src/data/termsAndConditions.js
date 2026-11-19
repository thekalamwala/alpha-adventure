import {
  ShieldCheck,
  CreditCard,
  CalendarX2,
  CloudLightning,
  Route,
  HeartPulse,
  Leaf,
  Users,
  Mountain,
  Backpack,
  AlertTriangle,
  Scale,
  Luggage,
  Handshake,
  Camera,
  Ban,
  Wind,
  FileText,
} from "lucide-react";

// Structured content for /terms-and-conditions. The wording is carried over
// verbatim from the original legal page; only the presentation is new.
export const termsIntro =
  "By booking or participating in any trek, trip, expedition, camp, workshop, or outdoor activity organised by Alpha Adventures, participants acknowledge that they have read, understood, and agreed to these Terms & Conditions.";

export const termsSections = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    icon: ShieldCheck,
    body: [
      {
        type: "p",
        text: "By booking or participating in any trek, trip, expedition, camp, workshop, or outdoor activity organised by Alpha Adventures, participants acknowledge that they have read, understood, and agreed to these Terms & Conditions.",
      },
    ],
  },
  {
    id: "booking-and-payments",
    title: "Booking Confirmation and Payments",
    icon: CreditCard,
    body: [
      {
        type: "ul",
        items: [
          "A booking is considered confirmed only upon receipt of the applicable booking amount or full payment.",
          "The remaining balance amount, if any, must be paid before the specified due date communicated by Alpha Adventures.",
          "Failure to complete payment within the prescribed timeline may result in cancellation of the booking.",
        ],
      },
    ],
  },
  {
    id: "cancellation-by-participant",
    title: "Cancellation by Participant",
    icon: CalendarX2,
    body: [
      {
        type: "ul",
        items: [
          "Participant cancellations shall be governed by the Alpha Adventures Cancellation Policy applicable to that particular trip or trek.",
          "Refunds, travel credits, or transfers, if applicable, shall be processed in accordance with the cancellation policy in effect at the time of booking.",
          "Charges paid towards permits, transport, accommodation, entry fees, and third-party services may be subject to separate cancellation policies and may be non-refundable.",
        ],
      },
    ],
  },
  {
    id: "cancellation-by-alpha-adventures",
    title: "Cancellation or Modification by Alpha Adventures",
    icon: CloudLightning,
    body: [
      {
        type: "p",
        text: "Alpha Adventures reserves the right to cancel, postpone, reroute, or modify any itinerary due to circumstances beyond its control including but not limited to:",
      },
      {
        type: "ul",
        items: [
          "Extreme weather conditions.",
          "Landslides, floods, avalanches, or natural disasters.",
          "Road closures or transportation disruptions.",
          "Government restrictions or administrative orders.",
          "Permit restrictions or non-availability of permits.",
          "Excessive crowding or public safety concerns.",
          "Political unrest or law and order situations.",
          "Fuel shortages or scarcity of essential resources.",
          "Public health emergencies or epidemics.",
          "Any operational, environmental, or safety concerns.",
        ],
      },
      {
        type: "p",
        text: "In such situations, participants will first be offered the option to transfer their booking to an alternative departure date or another trek/trip of equal value. If this option is not suitable, a refund as per the applicable policy shall be provided.",
      },
      {
        type: "p",
        text: "The decision of Alpha Adventures regarding cancellation, postponement, rerouting, or modification of any itinerary shall be final and binding.",
      },
    ],
  },
  {
    id: "itinerary-changes",
    title: "Itinerary Changes",
    icon: Route,
    body: [
      {
        type: "ul",
        items: [
          "The itinerary, route, accommodation, transportation, activities, and timings are subject to change depending upon weather conditions, road conditions, local regulations, permit availability, group fitness levels, and operational requirements.",
          "Safety, comfort, and the overall well-being of participants will always take priority over completing the planned itinerary.",
          "Decisions taken by trek leaders or the operations team regarding itinerary changes shall be final and binding on all participants.",
        ],
      },
    ],
  },
  {
    id: "fitness-and-medical",
    title: "Participant Fitness and Medical Declaration",
    icon: HeartPulse,
    body: [
      {
        type: "ul",
        items: [
          "Participants are responsible for ensuring that they are physically and mentally fit for the selected activity.",
          "Any medical conditions, allergies, injuries, recent surgeries, or ongoing treatments must be disclosed to Alpha Adventures prior to departure.",
          "Participants may be required to submit medical certificates for certain expeditions or high-altitude treks.",
          "Alpha Adventures reserves the right to refuse participation if a participant is found medically unfit or if their condition may pose a risk to themselves or the group.",
        ],
      },
    ],
  },
  {
    id: "responsible-conduct",
    title: "Responsible Conduct and Environmental Policy",
    icon: Leaf,
    body: [
      {
        type: "p",
        text: "Alpha Adventures follows a strict zero-tolerance policy towards the consumption, possession, or distribution of intoxicating substances during any trek, trip, expedition, or outdoor activity organised by us. This includes, but is not limited to, alcohol, cigarettes, tobacco products, vaping devices, recreational drugs, and any other intoxicating or prohibited substances.",
      },
      {
        type: "p",
        text: "Many of the destinations we visit are ecologically sensitive regions and hold deep cultural, religious, and spiritual significance for local communities. Participants are expected to respect local customs, traditions, places of worship, and the sentiments of the people who call these mountains and forests their home.",
      },
      {
        type: "p",
        text: "Alpha Adventures is committed to responsible and sustainable travel practices. Littering, smoking, spitting, plastic waste disposal, vandalism, noise pollution, or any activity that harms the environment or disturbs the sanctity of the destination will not be tolerated under any circumstances.",
      },
      {
        type: "p",
        text: "Participants are expected to follow the principles of responsible travel and leave every destination cleaner than they found it.",
      },
      {
        type: "p",
        text: "Any violation of this policy may result in immediate removal from the trek or trip without any refund, and the participant shall bear any costs arising from such action.",
      },
    ],
  },
  {
    id: "code-of-conduct",
    title: "Participant Code of Conduct",
    icon: Users,
    body: [
      {
        type: "ul",
        items: [
          "Participants must follow instructions provided by trek leaders, guides, coordinators, and support staff at all times.",
          "Behaviour that endangers the safety or experience of other participants will not be tolerated.",
          "Harassment, abusive language, violence, discrimination, or misconduct towards fellow participants, staff, local residents, or service providers may result in immediate removal from the trip without refund.",
          "Participants are expected to maintain discipline and cooperate with the group throughout the duration of the trip.",
        ],
      },
    ],
  },
  {
    id: "trek-leader-authority",
    title: "Authority of Trek Leaders",
    icon: Mountain,
    body: [
      {
        type: "ul",
        items: [
          "Trek leaders and coordinators have complete authority regarding safety-related decisions during the trip.",
          "They may modify routes, change plans, initiate evacuations, or discontinue a participant's involvement if deemed necessary for safety reasons.",
          "Such decisions shall be final and made in the interest of participant safety and operational feasibility.",
        ],
      },
    ],
  },
  {
    id: "equipment-and-documents",
    title: "Personal Equipment and Documentation",
    icon: Backpack,
    body: [
      {
        type: "ul",
        items: [
          "Participants are responsible for carrying all mandatory equipment and personal gear mentioned in the trip briefing or packing list.",
          "Participants are responsible for carrying valid government-issued identity proof and any permits or documents required for the trip.",
          "Failure to carry mandatory gear or documents may result in denial of participation without refund.",
        ],
      },
    ],
  },
  {
    id: "assumption-of-risk",
    title: "Assumption of Risk",
    icon: AlertTriangle,
    body: [
      {
        type: "p",
        text: "Adventure travel activities involve inherent risks including but not limited to:",
      },
      {
        type: "ul",
        items: [
          "Slips, falls, and injuries.",
          "Altitude-related illnesses.",
          "Extreme weather conditions.",
          "Delays and transportation disruptions.",
          "Wildlife encounters.",
          "Evacuation challenges in remote regions.",
        ],
      },
      {
        type: "p",
        text: "By participating, travellers voluntarily accept these risks and agree that Alpha Adventures shall not be held liable for incidents arising from risks inherent to adventure travel activities.",
      },
    ],
  },
  {
    id: "limitation-of-liability",
    title: "Limitation of Liability",
    icon: Scale,
    body: [
      {
        type: "ul",
        items: [
          "Alpha Adventures shall not be held liable for any loss, damage, injury, illness, delay, accident, or expense arising due to circumstances beyond its reasonable control.",
          "Participants undertake all activities at their own risk and responsibility.",
        ],
      },
    ],
  },
  {
    id: "personal-belongings",
    title: "Personal Belongings",
    icon: Luggage,
    body: [
      {
        type: "p",
        text: "Participants are solely responsible for their personal belongings, luggage, gadgets, valuables, travel documents, and equipment throughout the trip.",
      },
      {
        type: "p",
        text: "Alpha Adventures shall not be responsible for loss, theft, damage, or misplacement of personal property.",
      },
    ],
  },
  {
    id: "third-party-services",
    title: "Third-Party Services",
    icon: Handshake,
    body: [
      {
        type: "p",
        text: "Certain services such as transportation, accommodation, permits, local guides, activities, and meals may be provided by third-party vendors.",
      },
      {
        type: "p",
        text: "While Alpha Adventures carefully selects its service partners, it cannot be held responsible for delays, deficiencies, cancellations, service failures, or disputes arising from third-party providers.",
      },
    ],
  },
  {
    id: "photography-and-media",
    title: "Photography and Media Consent",
    icon: Camera,
    body: [
      {
        type: "p",
        text: "Alpha Adventures may capture photographs and videos during treks and trips for documentation and promotional purposes.",
      },
      {
        type: "p",
        text: "By participating, travellers grant permission for these photographs and videos to be used on social media platforms, websites, brochures, advertisements, and other marketing materials.",
      },
      {
        type: "p",
        text: "Participants who do not wish to appear in promotional content must inform Alpha Adventures in writing prior to the commencement of the trip.",
      },
    ],
  },
  {
    id: "unused-services",
    title: "Unused Services",
    icon: Ban,
    body: [
      {
        type: "p",
        text: "No refunds, credits, or adjustments shall be provided for meals, accommodation, transport, activities, or services not utilised by participants after the commencement of the trip due to personal reasons, illness, early departure, or non-participation.",
      },
    ],
  },
  {
    id: "force-majeure",
    title: "Force Majeure",
    icon: Wind,
    body: [
      {
        type: "p",
        text: "Alpha Adventures shall not be liable for any delay, cancellation, loss, or additional expenses arising from events beyond reasonable control, including but not limited to natural disasters, extreme weather, strikes, political disturbances, epidemics, government restrictions, transportation disruptions, or acts of God.",
      },
    ],
  },
  {
    id: "amendments",
    title: "Amendments",
    icon: FileText,
    body: [
      {
        type: "p",
        text: "Alpha Adventures reserves the right to modify, update, or amend these Terms & Conditions at any time without prior notice.",
      },
      {
        type: "p",
        text: "The Terms & Conditions published on the website at the time of booking shall apply to that booking.",
      },
    ],
  },
];
