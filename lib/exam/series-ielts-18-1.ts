import type { ExamSeriesData } from "./types";
import type { IeltsQuestion, IeltsSeriesData } from "./ielts-types";

// ============================================================================
// SECTION 1: READING GENERAL TRAINING (40 QUESTIONS, 60 MINUTES)
// Standard Cambridge IELTS 18 — Test 1 (General Training)
// ============================================================================

export const IELTS_18_READING_QUESTIONS: IeltsQuestion[] = [
  // --------------------------------------------------------------------------
  // SECTION 1 — SOCIAL SURVIVAL (Questions 1 to 14)
  // Passage 1A: Citylink Smart Transit Card (Q1–Q7: True / False / Not Given)
  // Passage 1B: Highfield Community Sports Hub (Q8–Q14: Multiple Choice)
  // --------------------------------------------------------------------------
  {
    id: "ielts-18-1-r-q1",
    questionNumber: 1,
    sectionNumber: 1,
    ieltsType: "true_false_not_given",
    nclcTargetLevel: 6,
    targetBandScore: 6.0,
    documentText:
      "CITYLINK SMART TRAVEL PASS — USER REGULATIONS\n\nThe Citylink Smart Pass provides unlimited travel on metropolitan buses, trams, and suburban rail networks across Zones 1 to 4. Passengers must tap their card against the electronic validator upon boarding and exiting every vehicle. Failure to validate will result in an automatic maximum fare penalty deducted at midnight.\n\nDiscounts apply automatically for seniors (aged 65+) and full-time tertiary students who register their cards online with verified credentials. Registered cards are also protected against theft or loss: any remaining balance can be transferred to a replacement card within 24 hours of notification.",
    prompt: "Passengers who forget to validate their card when leaving a vehicle are charged an additional penalty fee.",
    options: {
      A: "TRUE",
      B: "FALSE",
      C: "NOT GIVEN",
    },
    correctOption: "A",
    explanation:
      "The text states: 'Failure to validate will result in an automatic maximum fare penalty deducted at midnight.' Therefore, the statement is TRUE.",
    trapAnalysis:
      "Don't confuse 'penalty deducted at midnight' with an on-the-spot fine from an inspector. The deduction is automatic.",
  },
  {
    id: "ielts-18-1-r-q2",
    questionNumber: 2,
    sectionNumber: 1,
    ieltsType: "true_false_not_given",
    nclcTargetLevel: 6,
    targetBandScore: 6.0,
    documentText:
      "CITYLINK SMART TRAVEL PASS — USER REGULATIONS\n\nThe Citylink Smart Pass provides unlimited travel on metropolitan buses, trams, and suburban rail networks across Zones 1 to 4. Passengers must tap their card against the electronic validator upon boarding and exiting every vehicle. Failure to validate will result in an automatic maximum fare penalty deducted at midnight.\n\nDiscounts apply automatically for seniors (aged 65+) and full-time tertiary students who register their cards online with verified credentials. Registered cards are also protected against theft or loss: any remaining balance can be transferred to a replacement card within 24 hours of notification.",
    prompt: "High school pupils receive the same concessionary travel rates as tertiary university students.",
    options: {
      A: "TRUE",
      B: "FALSE",
      C: "NOT GIVEN",
    },
    correctOption: "C",
    explanation:
      "The text specifies discounts for seniors (65+) and 'full-time tertiary students', but nowhere does it mention high school or secondary school pupils. Thus, the information is NOT GIVEN.",
    trapAnalysis:
      "Classic IELTS trap: assuming secondary school pupils are automatically included under 'students'. If it's not stated, the answer is NOT GIVEN.",
  },
  {
    id: "ielts-18-1-r-q3",
    questionNumber: 3,
    sectionNumber: 1,
    ieltsType: "true_false_not_given",
    nclcTargetLevel: 6,
    targetBandScore: 6.5,
    documentText:
      "CITYLINK SMART TRAVEL PASS — USER REGULATIONS\n\nThe Citylink Smart Pass provides unlimited travel on metropolitan buses, trams, and suburban rail networks across Zones 1 to 4. Passengers must tap their card against the electronic validator upon boarding and exiting every vehicle. Failure to validate will result in an automatic maximum fare penalty deducted at midnight.\n\nDiscounts apply automatically for seniors (aged 65+) and full-time tertiary students who register their cards online with verified credentials. Registered cards are also protected against theft or loss: any remaining balance can be transferred to a replacement card within 24 hours of notification.",
    prompt: "Unregistered cards cannot have their remaining monetary balance recovered if lost or stolen.",
    options: {
      A: "TRUE",
      B: "FALSE",
      C: "NOT GIVEN",
    },
    correctOption: "A",
    explanation:
      "The text specifies that 'Registered cards are also protected against theft or loss: any remaining balance can be transferred...'. It implies unregistered cards do not have this protection.",
    trapAnalysis:
      "The conditional phrasing clearly restricts balance recovery to registered cardholders.",
  },
  {
    id: "ielts-18-1-r-q4",
    questionNumber: 4,
    sectionNumber: 1,
    ieltsType: "true_false_not_given",
    nclcTargetLevel: 7,
    targetBandScore: 7.0,
    documentText:
      "CITYLINK SMART TRAVEL PASS — TOP-UP & AUTO-RELOAD\n\nUsers can replenish credit online, at station vending kiosks, or through participating convenience stores. Setting up an 'Auto-Reload' feature guarantees that whenever the balance falls beneath £5.00, a pre-authorized £20.00 charge is made to your linked debit or credit card. No transaction fees apply to automated reloads, whereas credit card payments at retail kiosks incur a standard 1.5% surcharge.",
    prompt: "A surcharge of 1.5% is applied to every online top-up transaction.",
    options: {
      A: "TRUE",
      B: "FALSE",
      C: "NOT GIVEN",
    },
    correctOption: "B",
    explanation:
      "The text specifies: 'No transaction fees apply to automated reloads, whereas credit card payments at retail kiosks incur a standard 1.5% surcharge.' Online or automated reloads incur NO fees. Thus, the statement is FALSE.",
    trapAnalysis:
      "Beware of false attribution: the 1.5% surcharge applies strictly to credit cards at retail kiosks, not online automated top-ups.",
  },
  {
    id: "ielts-18-1-r-q5",
    questionNumber: 5,
    sectionNumber: 1,
    ieltsType: "true_false_not_given",
    nclcTargetLevel: 7,
    targetBandScore: 7.0,
    documentText:
      "CITYLINK SMART TRAVEL PASS — PEAK HOURS & WEEKEND PASSES\n\nPeak travel hours are defined as 06:30 to 09:30 and 16:00 to 19:00 on Mondays through Fridays. Weekend journeys are subject to an all-day off-peak daily cap of £6.50 regardless of the number of transfers across Zones 1 and 2. Children under the age of 11 travel free when accompanied by a fare-paying adult holding an active pass.",
    prompt: "On Saturdays and Sundays, passengers traveling in Zone 1 and 2 will not pay more than £6.50 per day.",
    options: {
      A: "TRUE",
      B: "FALSE",
      C: "NOT GIVEN",
    },
    correctOption: "A",
    explanation:
      "The text states: 'Weekend journeys are subject to an all-day off-peak daily cap of £6.50 regardless of the number of transfers across Zones 1 and 2.' This confirms the statement is TRUE.",
    trapAnalysis:
      "The term 'daily cap' means the maximum amount payable for the day.",
  },
  {
    id: "ielts-18-1-r-q6",
    questionNumber: 6,
    sectionNumber: 1,
    ieltsType: "true_false_not_given",
    nclcTargetLevel: 7,
    targetBandScore: 7.0,
    documentText:
      "CITYLINK SMART TRAVEL PASS — PEAK HOURS & WEEKEND PASSES\n\nPeak travel hours are defined as 06:30 to 09:30 and 16:00 to 19:00 on Mondays through Fridays. Weekend journeys are subject to an all-day off-peak daily cap of £6.50 regardless of the number of transfers across Zones 1 and 2. Children under the age of 11 travel free when accompanied by a fare-paying adult holding an active pass.",
    prompt: "Children under 11 must hold their own registered Smart Pass to qualify for free weekend travel.",
    options: {
      A: "TRUE",
      B: "FALSE",
      C: "NOT GIVEN",
    },
    correctOption: "B",
    explanation:
      "The text says: 'Children under the age of 11 travel free when accompanied by a fare-paying adult holding an active pass.' There is no requirement for children to hold their own card. Hence, FALSE.",
    trapAnalysis:
      "The rule requires only the accompanying adult to have an active pass.",
  },
  {
    id: "ielts-18-1-r-q7",
    questionNumber: 7,
    sectionNumber: 1,
    ieltsType: "true_false_not_given",
    nclcTargetLevel: 7,
    targetBandScore: 7.5,
    documentText:
      "CITYLINK SMART TRAVEL PASS — PEAK HOURS & WEEKEND PASSES\n\nPeak travel hours are defined as 06:30 to 09:30 and 16:00 to 19:00 on Mondays through Fridays. Weekend journeys are subject to an all-day off-peak daily cap of £6.50 regardless of the number of transfers across Zones 1 and 2. Children under the age of 11 travel free when accompanied by a fare-paying adult holding an active pass.",
    prompt: "The transport network plans to introduce new hybrid hydrogen buses next year.",
    options: {
      A: "TRUE",
      B: "FALSE",
      C: "NOT GIVEN",
    },
    correctOption: "C",
    explanation:
      "The passage focuses solely on fare rules, validation, and peak hours. Future bus technologies are not mentioned at all. Hence, NOT GIVEN.",
    trapAnalysis:
      "A plausible real-world fact that is completely absent from the text is always NOT GIVEN.",
  },

  // Passage 1B: Highfield Community Sports Hub (Q8–Q14: Multiple Choice)
  {
    id: "ielts-18-1-r-q8",
    questionNumber: 8,
    sectionNumber: 1,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 6,
    targetBandScore: 6.5,
    documentText:
      "HIGHFIELD COMMUNITY SPORTS HUB — MEMBERSHIP OPTIONS\n\nLocated in North Bristol, the Highfield Hub provides state-of-the-art recreational facilities:\n\n• STANDARD PASS (£32/month): Access to gym equipment, 25m swimming pool, and public badminton courts from 07:00 to 16:00 on weekdays.\n• ALL-HOURS VIP PASS (£48/month): 24/7 gym access, unlimited studio fitness classes (Pilates, HIIT, Spinning), and complimentary towel service.\n• OFF-PEAK SWIM PASS (£22/month): Pool access strictly between 10:00 and 14:00, Monday to Friday.\n\nLockers require a £1 returnable coin or an official Highfield digital padlock (£4.50 at reception). New members must complete a mandatory 30-minute health assessment and orientation before their first gym workout.",
    prompt: "Which membership tier allows access to studio fitness classes without an extra charge?",
    options: {
      A: "Standard Pass.",
      B: "All-Hours VIP Pass.",
      C: "Off-Peak Swim Pass.",
      D: "All membership tiers include studio classes.",
    },
    correctOption: "B",
    explanation:
      "The text specifies under ALL-HOURS VIP PASS: 'unlimited studio fitness classes (Pilates, HIIT, Spinning)'.",
    trapAnalysis:
      "Standard Pass only covers gym equipment, swimming pool, and badminton courts.",
  },
  {
    id: "ielts-18-1-r-q9",
    questionNumber: 9,
    sectionNumber: 1,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 6,
    targetBandScore: 6.5,
    documentText:
      "HIGHFIELD COMMUNITY SPORTS HUB — MEMBERSHIP OPTIONS\n\nNew members must complete a mandatory 30-minute health assessment and orientation before their first gym workout. Changing rooms are equipped with electronic vanity mirrors and private showers. Lockers require a £1 returnable coin or an official Highfield digital padlock (£4.50 at reception).",
    prompt: "What must all new gym users do prior to exercising?",
    options: {
      A: "Purchase an official digital padlock at reception.",
      B: "Undergo a half-hour health assessment and induction.",
      C: "Deposit £4.50 into their member wallet.",
      D: "Book private shower facilities in advance.",
    },
    correctOption: "B",
    explanation:
      "The text explicitly states: 'New members must complete a mandatory 30-minute health assessment and orientation before their first gym workout.'",
    trapAnalysis:
      "A and C confuse padlock purchase with the mandatory prerequisite.",
  },
  {
    id: "ielts-18-1-r-q10",
    questionNumber: 10,
    sectionNumber: 1,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 7,
    targetBandScore: 7.0,
    documentText:
      "HIGHFIELD SPORTS HUB — BOOKING & CANCELLATION RULES\n\nBadminton and squash courts can be reserved up to 14 days in advance via the mobile app. Members who cancel court bookings with less than 12 hours' notice will incur a £5.00 late cancellation penalty. Non-attendance without notice will result in the suspension of booking privileges for a 14-day period.",
    prompt: "What happens if a member fails to show up for a booked court without cancelling?",
    options: {
      A: "They are charged a standard £5.00 fee.",
      B: "Their membership is immediately terminated.",
      C: "They are prohibited from making reservations for two weeks.",
      D: "They must pay the full court hire fee in cash.",
    },
    correctOption: "C",
    explanation:
      "'Non-attendance without notice will result in the suspension of booking privileges for a 14-day period' (= two weeks).",
    trapAnalysis:
      "£5.00 applies to cancellations with less than 12 hours' notice, while total non-attendance triggers a 14-day suspension.",
  },
  {
    id: "ielts-18-1-r-q11",
    questionNumber: 11,
    sectionNumber: 1,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 7,
    targetBandScore: 7.0,
    documentText:
      "HIGHFIELD SPORTS HUB — JUNIOR POLICIES\n\nChildren aged 12 to 15 are permitted in the fitness suite during designated 'Teen Fit' hours (15:30 to 17:30 weekdays and 09:00 to 12:00 Saturdays), provided they are supervised by a parent or qualified instructor. Free weight areas containing barbells and dumbbells exceeding 10 kg remain strictly off-limits to under-16s under all circumstances.",
    prompt: "Which facility is strictly forbidden to adolescents under 16 years of age?",
    options: {
      A: "The 25-metre swimming pool.",
      B: "The cardio treadmills during Teen Fit sessions.",
      C: "Free weights exceeding ten kilograms.",
      D: "The squash and badminton courts.",
    },
    correctOption: "C",
    explanation:
      "'Free weight areas containing barbells and dumbbells exceeding 10 kg remain strictly off-limits to under-16s under all circumstances.'",
    trapAnalysis:
      "They are allowed in the gym during Teen Fit hours, but heavy free weights (>10 kg) are entirely prohibited.",
  },
  {
    id: "ielts-18-1-r-q12",
    questionNumber: 12,
    sectionNumber: 1,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 7,
    targetBandScore: 7.0,
    documentText:
      "HIGHFIELD SPORTS HUB — GUEST POLICY\n\nVIP members are entitled to bring two complimentary guests per calendar month. Standard members may purchase guest day passes for £8.00 per person. All guests must provide photo identification and register at reception before entering the workout floor.",
    prompt: "How many free guest visits does a VIP member receive every month?",
    options: {
      A: "One guest visit.",
      B: "Two guest visits.",
      C: "Four guest visits.",
      D: "Unlimited guest visits.",
    },
    correctOption: "B",
    explanation:
      "The text says: 'VIP members are entitled to bring two complimentary guests per calendar month.'",
    trapAnalysis:
      "Complimentary = free.",
  },
  {
    id: "ielts-18-1-r-q13",
    questionNumber: 13,
    sectionNumber: 1,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 7,
    targetBandScore: 7.5,
    documentText:
      "HIGHFIELD SPORTS HUB — PARKING & TRANSPORT\n\nComplimentary on-site parking is available for up to three hours for active members using the facility. Drivers must enter their vehicle registration number on the touchscreen terminal inside the main foyer to validate their stay. Vehicles exceeding the three-hour threshold without prior manager approval are issued an automated £60 civil penalty notice by our third-party parking enforcement contractor.",
    prompt: "What must drivers do to avoid being fined while parked at the centre?",
    options: {
      A: "Pay £60 at the reception desk before working out.",
      B: "Leave their vehicle keys with the manager.",
      C: "Input their license plate number on the lobby console.",
      D: "Park for less than one hour only.",
    },
    correctOption: "C",
    explanation:
      "'Drivers must enter their vehicle registration number on the touchscreen terminal inside the main foyer to validate their stay.'",
    trapAnalysis:
      "Vehicle registration number = license plate; touchscreen terminal in foyer = lobby console.",
  },
  {
    id: "ielts-18-1-r-q14",
    questionNumber: 14,
    sectionNumber: 1,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 7,
    targetBandScore: 7.5,
    documentText:
      "HIGHFIELD SPORTS HUB — CONTACT & INQUIRIES\n\nFor membership suspension inquiries due to medical circumstances or prolonged overseas travel, please submit a written request accompanied by relevant documentation to membership@highfieldhub.co.uk at least seven working days before your next direct debit billing date.",
    prompt: "What is required to temporarily freeze a membership for medical reasons?",
    options: {
      A: "Visiting the centre in person on the day of billing.",
      B: "Sending written proof by email at least seven working days ahead of billing.",
      C: "Cancelling your direct debit mandate directly with your bank.",
      D: "Paying an immediate £60 administrative freeze fee.",
    },
    correctOption: "B",
    explanation:
      "'submit a written request accompanied by relevant documentation to membership@highfieldhub.co.uk at least seven working days before your next direct debit billing date.'",
    trapAnalysis:
      "Cancelling direct debit with the bank without notice leads to default penalties, not a legitimate freeze.",
  },

  // --------------------------------------------------------------------------
  // SECTION 2 — WORKPLACE CONTEXT (Questions 15 to 27)
  // Passage 2A: Flexible Working & Ergonomic Guidelines (Q15–Q21)
  // Passage 2B: Company Travel Expense Reimbursement Policy (Q22–Q27)
  // --------------------------------------------------------------------------
  {
    id: "ielts-18-1-r-q15",
    questionNumber: 15,
    sectionNumber: 2,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 7,
    targetBandScore: 7.5,
    documentText:
      "NOVATEL ENTERPRISE — HYBRID WORK & ERGONOMICS POLICY\n\n1. ELIGIBILITY AND SCHEDULES\nFull-time permanent staff who have successfully passed their six-month probationary review may request up to two remote working days per week. Core hours remain 09:30 to 15:30, during which all team members must be reachable via instant messaging and video conferencing, regardless of physical work location.\n\n2. WORKSTATION HEALTH & SAFETY\nEmployees working remotely are legally covered by corporate employer liability insurance only if their home workstation complies with Display Screen Equipment (DSE) regulations. The company provides a one-off ergonomic equipment allowance of up to £350 upon submission of valid receipts for approved items (e.g., lumbar support chairs, adjustable monitor arms, external keyboards).",
    prompt: "Who is eligible to apply for hybrid remote working at Novatel?",
    options: {
      A: "All contract and seasonal workers from their first week.",
      B: "Permanent staff who have completed their six-month probation.",
      C: "Employees who work overtime on weekends.",
      D: "Only department heads and senior directors.",
    },
    correctOption: "B",
    explanation:
      "The text says: 'Full-time permanent staff who have successfully passed their six-month probationary review may request up to two remote working days per week.'",
    trapAnalysis:
      "Probationary staff cannot apply until they have completed 6 months.",
  },
  {
    id: "ielts-18-1-r-q16",
    questionNumber: 16,
    sectionNumber: 2,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 7,
    targetBandScore: 7.5,
    documentText:
      "NOVATEL ENTERPRISE — HYBRID WORK & ERGONOMICS POLICY\n\nCore hours remain 09:30 to 15:30, during which all team members must be reachable via instant messaging and video conferencing, regardless of physical work location.\n\nThe company provides a one-off ergonomic equipment allowance of up to £350 upon submission of valid receipts for approved items (e.g., lumbar support chairs, adjustable monitor arms, external keyboards).",
    prompt: "What is the maximum subsidy provided for approved ergonomic home equipment?",
    options: {
      A: "£200 per year.",
      B: "£350 as a one-time allowance.",
      C: "£500 subject to manager sign-off.",
      D: "The company provides all equipment directly with no financial allowance.",
    },
    correctOption: "B",
    explanation:
      "'The company provides a one-off ergonomic equipment allowance of up to £350 upon submission of valid receipts.'",
    trapAnalysis:
      "It is a 'one-off' (one-time) allowance, not an annual budget.",
  },
  {
    id: "ielts-18-1-r-q17",
    questionNumber: 17,
    sectionNumber: 2,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 7,
    targetBandScore: 7.5,
    documentText:
      "NOVATEL ENTERPRISE — HYBRID WORK & ERGONOMICS POLICY\n\n3. DATA SECURITY PROTOCOLS\nCompany laptops must connect to the corporate Virtual Private Network (VPN) at all times when handling client-identifiable data. The use of unsecured public Wi-Fi networks (e.g., cafes, airports) without VPN encryption is classified as a severe security breach and may result in disciplinary action up to summary dismissal.",
    prompt: "What is strictly prohibited when handling sensitive company data remotely?",
    options: {
      A: "Working after 17:00 on weekdays.",
      B: "Using an external monitor or mouse.",
      C: "Connecting to open public Wi-Fi without VPN encryption.",
      D: "Saving documents in local cloud storage folders.",
    },
    correctOption: "C",
    explanation:
      "'The use of unsecured public Wi-Fi networks (e.g., cafes, airports) without VPN encryption is classified as a severe security breach.'",
    trapAnalysis:
      "VPN connection is mandatory whenever connecting on public networks.",
  },
  {
    id: "ielts-18-1-r-q18",
    questionNumber: 18,
    sectionNumber: 2,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 8,
    targetBandScore: 8.0,
    documentText:
      "NOVATEL ENTERPRISE — HYBRID WORK & ERGONOMICS POLICY\n\n4. RIGHT TO DISCONNECT\nNovatel upholds employee wellbeing through our 'Digital Sunset' guideline. Managers are expressly instructed not to schedule meetings before 09:00 or after 17:00. While asynchronous emails may be dispatched outside working hours, recipients are under no professional obligation to acknowledge or respond until the subsequent scheduled working day.",
    prompt: "Under the 'Digital Sunset' principle, what expectation exists regarding late-evening emails?",
    options: {
      A: "They must be answered within two hours.",
      B: "They are automatically blocked by the email server.",
      C: "Recipients do not have to respond until their next working day.",
      D: "Managers are penalized if they draft emails in the evening.",
    },
    correctOption: "C",
    explanation:
      "'recipients are under no professional obligation to acknowledge or respond until the subsequent scheduled working day.'",
    trapAnalysis:
      "Emails may still be dispatched, but response obligation only begins the next working day.",
  },
  {
    id: "ielts-18-1-r-q19",
    questionNumber: 19,
    sectionNumber: 2,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 8,
    targetBandScore: 8.0,
    documentText:
      "NOVATEL ENTERPRISE — HYBRID WORK & ERGONOMICS POLICY\n\n5. ANNUAL REVIEW AND REVOCATION\nHybrid arrangements are privileges subject to operational requirements, not contractual entitlements. If an individual's key performance indicators (KPIs) decline by more than 15% over a quarterly assessment cycle, line managers retain the right to suspend home working permissions following a formal performance review meeting.",
    prompt: "Under what condition may remote working permission be rescinded?",
    options: {
      A: "If the company changes its headquarters address.",
      B: "If an employee's measured KPIs fall by over 15% in a quarter.",
      C: "If an employee takes more than five days of sick leave.",
      D: "If any colleague complains about lack of communication.",
    },
    correctOption: "B",
    explanation:
      "'If an individual's key performance indicators (KPIs) decline by more than 15% over a quarterly assessment cycle... line managers retain the right to suspend home working permissions.'",
    trapAnalysis:
      "Rescinded = suspended / revoked.",
  },
  {
    id: "ielts-18-1-r-q20",
    questionNumber: 20,
    sectionNumber: 2,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 8,
    targetBandScore: 8.0,
    documentText:
      "NOVATEL ENTERPRISE — HYBRID WORK & ERGONOMICS POLICY\n\n6. ACCIDENT REPORTING AT HOME\nAny workplace injury sustained during designated working hours in an employee's home office must be reported to the Health & Safety officer via the internal portal within 24 hours, including digital photographs of the workspace layout and equipment involved.",
    prompt: "How soon must a home workstation incident be reported to company authorities?",
    options: {
      A: "Immediately within two hours.",
      B: "Within 24 hours, supported by photos.",
      C: "By the end of the calendar month.",
      D: "Only during annual health reviews.",
    },
    correctOption: "B",
    explanation:
      "'must be reported to the Health & Safety officer via the internal portal within 24 hours, including digital photographs.'",
    trapAnalysis:
      "24 hours is the official statutory internal deadline.",
  },
  {
    id: "ielts-18-1-r-q21",
    questionNumber: 21,
    sectionNumber: 2,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 8,
    targetBandScore: 8.0,
    documentText:
      "NOVATEL ENTERPRISE — HYBRID WORK & ERGONOMICS POLICY\n\n7. TAX AND UTILITIES\nNovatel does not provide direct stipends for residential heating, lighting, or broadband connections. Employees are encouraged to consult national tax authority guidelines (HMRC) regarding potential individual tax relief claims for home-based work.",
    prompt: "Does the company provide compensation for residential utility bills?",
    options: {
      A: "Yes, up to £50 monthly.",
      B: "Yes, if receipts are provided quarterly.",
      C: "No, but staff can seek statutory tax relief from the tax authorities.",
      D: "Only during winter heating months.",
    },
    correctOption: "C",
    explanation:
      "'Novatel does not provide direct stipends for residential heating, lighting, or broadband... Employees are encouraged to consult national tax authority guidelines (HMRC)'.",
    trapAnalysis:
      "Novatel provides zero direct utility stipends, redirecting staff to HMRC tax relief.",
  },

  // Passage 2B: Company Travel Expense Policy (Q22–Q27: True / False / Not Given)
  {
    id: "ielts-18-1-r-q22",
    questionNumber: 22,
    sectionNumber: 2,
    ieltsType: "true_false_not_given",
    nclcTargetLevel: 8,
    targetBandScore: 8.0,
    documentText:
      "NOVATEL ENTERPRISE — TRAVEL AND SUBSISTENCE EXPENSE GUIDELINES\n\nAll business travel must be pre-authorized by a Divisional Director via the Concur travel portal prior to making commercial bookings. Train travel within the UK should be booked in standard class; first-class bookings are permissible only for continuous journeys exceeding four hours where the traveler is expected to deliver a presentation on arrival.\n\nAccommodation caps are set at £130 per night outside London and £195 per night within Greater London. Breakfast is reimbursable up to £15 when not inclusive in the hotel room rate. Alcoholic beverages are non-reimbursable under any circumstances, including client entertainment dinners.",
    prompt: "First-class rail travel is allowed for UK domestic journeys lasting more than four hours if presenting on arrival.",
    options: {
      A: "TRUE",
      B: "FALSE",
      C: "NOT GIVEN",
    },
    correctOption: "A",
    explanation:
      "The text says: 'first-class bookings are permissible only for continuous journeys exceeding four hours where the traveler is expected to deliver a presentation on arrival.' This matches the statement. TRUE.",
    trapAnalysis:
      "Notice the dual condition: > 4 hours AND delivering a presentation on arrival.",
  },
  {
    id: "ielts-18-1-r-q23",
    questionNumber: 23,
    sectionNumber: 2,
    ieltsType: "true_false_not_given",
    nclcTargetLevel: 8,
    targetBandScore: 8.0,
    documentText:
      "NOVATEL ENTERPRISE — TRAVEL AND SUBSISTENCE EXPENSE GUIDELINES\n\nAccommodation caps are set at £130 per night outside London and £195 per night within Greater London. Breakfast is reimbursable up to £15 when not inclusive in the hotel room rate. Alcoholic beverages are non-reimbursable under any circumstances, including client entertainment dinners.",
    prompt: "Employees dining with prospective clients may expense wine and beer as long as the total meal cost is under £50.",
    options: {
      A: "TRUE",
      B: "FALSE",
      C: "NOT GIVEN",
    },
    correctOption: "B",
    explanation:
      "'Alcoholic beverages are non-reimbursable under any circumstances, including client entertainment dinners.' Hence, the statement is FALSE.",
    trapAnalysis:
      "'under any circumstances' means zero exceptions, even for client entertaining.",
  },
  {
    id: "ielts-18-1-r-q24",
    questionNumber: 24,
    sectionNumber: 2,
    ieltsType: "true_false_not_given",
    nclcTargetLevel: 8,
    targetBandScore: 8.5,
    documentText:
      "NOVATEL ENTERPRISE — TRAVEL AND SUBSISTENCE EXPENSE GUIDELINES\n\nMileage reimbursement for personal vehicle use on company business is fixed at 45 pence per mile for the first 10,000 miles in a financial year, decreasing to 25 pence per mile thereafter, in alignment with HMRC statutory thresholds. Staff must maintain an accurate logbook detailing dates, destination postcodes, and business purposes.",
    prompt: "Drivers receive a higher mileage rate after passing ten thousand miles in a financial year.",
    options: {
      A: "TRUE",
      B: "FALSE",
      C: "NOT GIVEN",
    },
    correctOption: "B",
    explanation:
      "The rate is 45p for the first 10,000 miles, 'decreasing to 25 pence per mile thereafter'. It decreases, it does not increase. FALSE.",
    trapAnalysis:
      "45p drops to 25p, so the rate becomes lower, not higher.",
  },
  {
    id: "ielts-18-1-r-q25",
    questionNumber: 25,
    sectionNumber: 2,
    ieltsType: "true_false_not_given",
    nclcTargetLevel: 8,
    targetBandScore: 8.5,
    documentText:
      "NOVATEL ENTERPRISE — TRAVEL AND SUBSISTENCE EXPENSE GUIDELINES\n\nAll expense claims must be submitted with itemized VAT receipts attached within 30 days of trip completion. Credit card payment slips alone are insufficient proof of purchase. Late claims submitted after 60 days will be rejected automatically unless extenuating medical leave prevented timely filing.",
    prompt: "Credit card slips without itemized VAT receipts are accepted for small expenses under £10.",
    options: {
      A: "TRUE",
      B: "FALSE",
      C: "NOT GIVEN",
    },
    correctOption: "B",
    explanation:
      "The text clearly states: 'All expense claims must be submitted with itemized VAT receipts attached... Credit card payment slips alone are insufficient proof of purchase.' There is no exception for small expenses. FALSE.",
    trapAnalysis:
      "No threshold exception exists in the text.",
  },
  {
    id: "ielts-18-1-r-q26",
    questionNumber: 26,
    sectionNumber: 2,
    ieltsType: "true_false_not_given",
    nclcTargetLevel: 8,
    targetBandScore: 8.5,
    documentText:
      "NOVATEL ENTERPRISE — TRAVEL AND SUBSISTENCE EXPENSE GUIDELINES\n\nInternational flights over eight hours are eligible for premium economy seating, subject to written budget sign-off from the Chief Financial Officer at least three weeks prior to departure.",
    prompt: "Flights to North America lasting seven hours qualify automatically for premium economy seating.",
    options: {
      A: "TRUE",
      B: "FALSE",
      C: "NOT GIVEN",
    },
    correctOption: "B",
    explanation:
      "The policy applies only to flights 'over eight hours'. A seven-hour flight does not qualify. FALSE.",
    trapAnalysis:
      "7 hours is under the required 8-hour threshold.",
  },
  {
    id: "ielts-18-1-r-q27",
    questionNumber: 27,
    sectionNumber: 2,
    ieltsType: "true_false_not_given",
    nclcTargetLevel: 8,
    targetBandScore: 8.5,
    documentText:
      "NOVATEL ENTERPRISE — TRAVEL AND SUBSISTENCE EXPENSE GUIDELINES\n\nEmployees travelling overseas are enrolled in the corporate emergency travel assistance program provided by International SOS. This covers emergency medical repatriation and crisis evacuation. Staff should download the smartphone app before international transit.",
    prompt: "Employees must pay a monthly premium to remain enrolled in the emergency travel insurance scheme.",
    options: {
      A: "TRUE",
      B: "FALSE",
      C: "NOT GIVEN",
    },
    correctOption: "C",
    explanation:
      "The text says employees are enrolled in the corporate program, but never mentions whether it is free or requires employee contributions. Hence, NOT GIVEN.",
    trapAnalysis:
      "Do not assume corporate programs are free unless the text explicitly states 'complimentary' or 'free of charge'.",
  },

  // --------------------------------------------------------------------------
  // SECTION 3 — EXTENDED ARTICLE (Questions 28 to 40)
  // Passage 3: "The Architecture of Ocean Governance & The Blue Economy"
  // (Questions 28 to 40: Analytical Reading & Complex Cambridge Formats)
  // --------------------------------------------------------------------------
  {
    id: "ielts-18-1-r-q28",
    questionNumber: 28,
    sectionNumber: 3,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 9,
    targetBandScore: 8.5,
    documentText:
      "THE ARCHITECTURE OF OCEAN GOVERNANCE & THE BLUE ECONOMY\n\n[Paragraph A]\nFor centuries, the world's high seas were perceived through the lens of Grotius's 1609 doctrine of 'Mare Liberum'—the open ocean as a boundless, unownable common belonging to all and masterable by none. Under this venerable framework, oceanic resources were treated as inexhaustible bounties, impervious to human depredation. Yet the past half-century has dismantled this romantic illusion. The convergence of industrial-scale pelagic trawlers, seabed mineral extraction technologies, and pervasive microplastic pollution has exposed the catastrophic vulnerability of our marine biosphere.",
    prompt: "What key assumption did Grotius's 1609 doctrine of 'Mare Liberum' establish regarding the oceans?",
    options: {
      A: "That maritime borders should be guarded by military naval alliances.",
      B: "That marine resources were virtually infinite and belonged to no single nation.",
      C: "That coastal nations possessed exclusive sovereign rights over pelagic fisheries.",
      D: "That international shipping routes required commercial licensing treaties.",
    },
    correctOption: "B",
    explanation:
      "Paragraph A states the open ocean was 'a boundless, unownable common belonging to all and masterable by none... oceanic resources were treated as inexhaustible bounties'.",
    trapAnalysis:
      "A, C and D represent modern regulatory and nationalistic concepts opposite to Grotius's open commons.",
  },
  {
    id: "ielts-18-1-r-q29",
    questionNumber: 29,
    sectionNumber: 3,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 9,
    targetBandScore: 8.5,
    documentText:
      "[Paragraph B]\nThe 1982 United Nations Convention on the Law of the Sea (UNCLOS) sought to introduce order by establishing Exclusive Economic Zones (EEZs), granting coastal nations sovereign stewardship over marine resources up to 200 nautical miles from their baselines. While this successfully nationalized over a third of the oceans, it simultaneously created an acute regulatory abyss beyond these boundaries. The high seas—accounting for roughly 64% of the surface of the oceans and 95% of its volume—remained governed by a patchwork of fragmented sector-specific bodies with overlapping mandates and toothless enforcement mechanisms.",
    prompt: "According to Paragraph B, what was an unintended consequence of establishing Exclusive Economic Zones (EEZs)?",
    options: {
      A: "It triggered worldwide naval skirmishes over the 200-mile demarcation lines.",
      B: "It left nearly two-thirds of the ocean beyond national jurisdiction governed by inadequate, fragmented oversight.",
      C: "It eliminated deep-sea fishing fleets across developing coastal states.",
      D: "It forced UNCLOS to hand all maritime authority to private shipping conglomerates.",
    },
    correctOption: "B",
    explanation:
      "The text states it 'created an acute regulatory abyss beyond these boundaries. The high seas—accounting for roughly 64%... remained governed by a patchwork of fragmented sector-specific bodies with overlapping mandates and toothless enforcement'.",
    trapAnalysis:
      "B precisely summarizes the 'regulatory abyss' and 'toothless enforcement' over the 64% high seas.",
  },
  {
    id: "ielts-18-1-r-q30",
    questionNumber: 30,
    sectionNumber: 3,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 9,
    targetBandScore: 8.5,
    documentText:
      "[Paragraph C]\nNowhere is this governance deficit more critical than in the nascent frontier of deep-sea mining. Seafloor hydrothermal vents and abyssal plains harbor dense concentrations of polymetallic nodules rich in nickel, cobalt, copper, and rare earths—the indispensable catalytic precursors of the green energy transition. Proponents assert that harvesting these oceanic deposits produces a dramatically lower carbon footprint and avoids the humanitarian controversies of terrestrial strip-mining in fragile rainforest ecosystems.",
    prompt: "Advocates of deep-sea mining argue that extracting seabed nodules is preferable because it:",
    options: {
      A: "Produces zero marine sound pollution compared to offshore drilling rigs.",
      B: "Requires no chemical refining once hauled to the water's surface.",
      C: "Has a lower carbon footprint and bypasses the environmental damage of onshore mining.",
      D: "Can be conducted exclusively inside established national territorial waters.",
    },
    correctOption: "C",
    explanation:
      "Paragraph C says proponents argue it 'produces a dramatically lower carbon footprint and avoids the humanitarian controversies of terrestrial strip-mining in fragile rainforest ecosystems.'",
    trapAnalysis:
      "Terrestrial = onshore. Carbon footprint and avoiding rainforest destruction are the explicit arguments cited.",
  },
  {
    id: "ielts-18-1-r-q31",
    questionNumber: 31,
    sectionNumber: 3,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 9,
    targetBandScore: 9.0,
    documentText:
      "[Paragraph D]\nMarine scientists, however, strike an ominous cautionary note. Benthic ecosystems operating in perpetual darkness and high hydrostatic pressure evolve over geological timescales; abyssal fauna regenerate at negligible rates. Sediment plumes churned up by crawling robotic harvesters could travel thousands of nautical miles, choking filter-feeding organisms throughout the water column and permanently altering carbon sequestration dynamics. Without baseline biological inventories of these abyssal trenches, commercial exploitation amounts to flying blind in the dark.",
    prompt: "What primary ecological danger do marine researchers highlight regarding robotic seabed harvesters?",
    options: {
      A: "The explosive leakage of high-pressure seabed methane gases.",
      B: "The extensive drift of sediment clouds that suffocates aquatic organisms and disrupts carbon cycles.",
      C: "The permanent heating of deep ocean waters caused by heavy robotic engines.",
      D: "The immediate extinction of commercial coastal tuna and salmon stocks.",
    },
    correctOption: "B",
    explanation:
      "'Sediment plumes churned up by crawling robotic harvesters could travel thousands of nautical miles, choking filter-feeding organisms... and permanently altering carbon sequestration dynamics.'",
    trapAnalysis:
      "Plumes = sediment clouds; choking = suffocating.",
  },
  {
    id: "ielts-18-1-r-q32",
    questionNumber: 32,
    sectionNumber: 3,
    ieltsType: "true_false_not_given",
    nclcTargetLevel: 9,
    targetBandScore: 9.0,
    documentText:
      "[Paragraph E]\nIn March 2023, after two decades of arduous diplomacy, delegates at the United Nations adopted the High Seas Treaty (officially the BBNJ Agreement: Biodiversity Beyond National Jurisdiction). The treaty establishes a binding legal framework to create Marine Protected Areas (MPAs) in international waters, mandates environmental impact assessments prior to deep-sea commercial activities, and introduces a mechanism for the equitable sharing of marine genetic resources. Conservationists hailed the accord as the maritime equivalent of the 2015 Paris Climate Agreement.",
    prompt: "The BBNJ Agreement took over twenty years of diplomatic negotiations to achieve international consensus.",
    options: {
      A: "TRUE",
      B: "FALSE",
      C: "NOT GIVEN",
    },
    correctOption: "A",
    explanation:
      "Paragraph E states: 'In March 2023, after two decades of arduous diplomacy, delegates at the United Nations adopted...'. Two decades = twenty years. TRUE.",
    trapAnalysis:
      "Two decades = over 20 years. Arduous diplomacy = diplomatic negotiations.",
  },
  {
    id: "ielts-18-1-r-q33",
    questionNumber: 33,
    sectionNumber: 3,
    ieltsType: "true_false_not_given",
    nclcTargetLevel: 9,
    targetBandScore: 9.0,
    documentText:
      "[Paragraph E]\nThe treaty establishes a binding legal framework to create Marine Protected Areas (MPAs) in international waters, mandates environmental impact assessments prior to deep-sea commercial activities, and introduces a mechanism for the equitable sharing of marine genetic resources. Conservationists hailed the accord as the maritime equivalent of the 2015 Paris Climate Agreement.",
    prompt: "The BBNJ Agreement was formally rejected by a coalition of major industrialized fishing nations.",
    options: {
      A: "TRUE",
      B: "FALSE",
      C: "NOT GIVEN",
    },
    correctOption: "B",
    explanation:
      "Paragraph E says delegates adopted the treaty and conservationists hailed it as a landmark equivalent to the Paris Agreement. No rejection is stated. FALSE.",
    trapAnalysis:
      "The passage explicitly states adoption, not formal rejection.",
  },
  {
    id: "ielts-18-1-r-q34",
    questionNumber: 34,
    sectionNumber: 3,
    ieltsType: "true_false_not_given",
    nclcTargetLevel: 9,
    targetBandScore: 9.0,
    documentText:
      "[Paragraph F]\nYet adoption is not ratification. The High Seas Treaty requires ratification by at least 60 member states to enter into force—a hurdle that could take years to surmount amid competing geopolitical agendas. Moreover, enforcement remains an unresolved dilemma. Unlike terrestrial sovereign borders patrolled by national police forces, the vastness of the high seas makes continuous surveillance virtually impossible without satellite tracking arrays, artificial intelligence vessel recognition, and shared multinational patrol budgets.",
    prompt: "Enforcement of the High Seas Treaty relies on conventional coastal police forces rather than satellite technology.",
    options: {
      A: "TRUE",
      B: "FALSE",
      C: "NOT GIVEN",
    },
    correctOption: "B",
    explanation:
      "Paragraph F contrasts high seas surveillance with terrestrial police forces, noting that international waters cannot be patrolled by traditional police and instead require 'satellite tracking arrays, artificial intelligence...'. FALSE.",
    trapAnalysis:
      "The author explicitly states the high seas CANNOT rely on traditional terrestrial police models.",
  },
  {
    id: "ielts-18-1-r-q35",
    questionNumber: 35,
    sectionNumber: 3,
    ieltsType: "true_false_not_given",
    nclcTargetLevel: 10,
    targetBandScore: 9.0,
    documentText:
      "[Paragraph F]\nYet adoption is not ratification. The High Seas Treaty requires ratification by at least 60 member states to enter into force—a hurdle that could take years to surmount amid competing geopolitical agendas. Moreover, enforcement remains an unresolved dilemma.",
    prompt: "All sixty required member states ratified the treaty within six months of its adoption.",
    options: {
      A: "TRUE",
      B: "FALSE",
      C: "NOT GIVEN",
    },
    correctOption: "B",
    explanation:
      "The text says ratification 'could take years to surmount amid competing geopolitical agendas', meaning it has NOT happened within six months. FALSE.",
    trapAnalysis:
      "Could take years contradicts 'ratified within six months'.",
  },
  {
    id: "ielts-18-1-r-q36",
    questionNumber: 36,
    sectionNumber: 3,
    ieltsType: "true_false_not_given",
    nclcTargetLevel: 10,
    targetBandScore: 9.0,
    documentText:
      "[Paragraph G]\nThe economic calculus of the 'Blue Economy' also demands scrutiny. Coastal communities in the Global South, whose livelihoods depend on artisanal artisanal fishing, increasingly find themselves squeezed out by industrial offshore fleets subsidized by foreign capitals. In West Africa alone, illicit, unreported, and unregulated (IUU) fishing drains over $2.3 billion annually from regional economies, precipitating food insecurity and fueling involuntary migration.",
    prompt: "Illegal and unregulated fishing in West Africa causes economic losses exceeding two billion dollars each year.",
    options: {
      A: "TRUE",
      B: "FALSE",
      C: "NOT GIVEN",
    },
    correctOption: "A",
    explanation:
      "Paragraph G confirms: 'In West Africa alone, illicit, unreported, and unregulated (IUU) fishing drains over $2.3 billion annually from regional economies'. TRUE.",
    trapAnalysis:
      "$2.3 billion annually = exceeding two billion dollars each year.",
  },
  {
    id: "ielts-18-1-r-q37",
    questionNumber: 37,
    sectionNumber: 3,
    ieltsType: "true_false_not_given",
    nclcTargetLevel: 10,
    targetBandScore: 9.0,
    documentText:
      "[Paragraph G]\nThe economic calculus of the 'Blue Economy' also demands scrutiny. Coastal communities in the Global South, whose livelihoods depend on artisanal artisanal fishing, increasingly find themselves squeezed out by industrial offshore fleets subsidized by foreign capitals.",
    prompt: "Artisanal fishers in West Africa receive equal subsidies compared to foreign industrial fishing vessels.",
    options: {
      A: "TRUE",
      B: "FALSE",
      C: "NOT GIVEN",
    },
    correctOption: "B",
    explanation:
      "The text notes that artisanal fishers are 'squeezed out by industrial offshore fleets subsidized by foreign capitals', demonstrating an unfair advantage, not equal subsidies. FALSE.",
    trapAnalysis:
      "Subsidies flow to foreign industrial fleets, penalizing small-scale artisanal fishers.",
  },
  {
    id: "ielts-18-1-r-q38",
    questionNumber: 38,
    sectionNumber: 3,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 10,
    targetBandScore: 9.0,
    documentText:
      "[Paragraph H]\nUltimately, genuine ocean stewardship requires reimagining our philosophical relationship with the marine commons. Valuing oceans merely as liquid highways for commercial transit or warehouses of exploitable minerals repeats the extractive hubris that pushed our terrestrial ecosystems to the brink. If the 21st-century Blue Economy is to be sustainable, economic growth must be decoupled from ecological depletion, subordinating short-term resource extraction to the overarching imperative of planetary equilibrium.",
    prompt: "What is the author's primary conclusion in the final paragraph?",
    options: {
      A: "All commercial shipping activities across the high seas must be permanently banned.",
      B: "Ocean governance must subordinate commercial exploitation to the long-term imperative of planetary ecological balance.",
      C: "Deep-sea mining should proceed unregulated to fund marine conservation biology.",
      D: "Terrestrial ecosystems have recovered sufficiently to resume heavy inland mining.",
    },
    correctOption: "B",
    explanation:
      "Paragraph H concludes: 'economic growth must be decoupled from ecological depletion, subordinating short-term resource extraction to the overarching imperative of planetary equilibrium.'",
    trapAnalysis:
      "B is a faithful paraphrase of the closing thesis statement.",
  },
  {
    id: "ielts-18-1-r-q39",
    questionNumber: 39,
    sectionNumber: 3,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 10,
    targetBandScore: 9.0,
    documentText:
      "[Paragraph H]\nValuing oceans merely as liquid highways for commercial transit or warehouses of exploitable minerals repeats the extractive hubris that pushed our terrestrial ecosystems to the brink.",
    prompt: "What does the phrase 'extractive hubris' denote in the context of Paragraph H?",
    options: {
      A: "The technical prowess of maritime engineers.",
      B: "An arrogant overconfidence in human ability to deplete natural resources without consequence.",
      C: "The financial efficiency of modern container shipping lines.",
      D: "A scientific modesty in acknowledging biological boundaries.",
    },
    correctOption: "B",
    explanation:
      "Hubris is ancient Greek for excessive pride or arrogance; 'extractive hubris' refers to the dangerous arrogance of over-extracting resources.",
    trapAnalysis:
      "B precisely captures the literary and philosophical connotation of 'hubris'.",
  },
  {
    id: "ielts-18-1-r-q40",
    questionNumber: 40,
    sectionNumber: 3,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 10,
    targetBandScore: 9.0,
    documentText:
      "THE ARCHITECTURE OF OCEAN GOVERNANCE & THE BLUE ECONOMY\n\n[Review of Complete Article]",
    prompt: "Which title best summarizes the central theme of the entire reading passage?",
    options: {
      A: "The Decline of Naval Military Tactics in the Post-Cold War Era.",
      B: "From Mare Liberum to High Seas Stewardship: Navigating Conservation and Resource Exploitation.",
      C: "Why Terrestrial Mining Has Become Economically Unviable.",
      D: "A Guide to Commercial Coastal Aquaculture in the Global South.",
    },
    correctOption: "B",
    explanation:
      "The article traces the arc from Grotius's 1609 'Mare Liberum' to UNCLOS, deep-sea mining, the 2023 High Seas Treaty, and the need for ethical oceanic stewardship.",
    trapAnalysis:
      "B encompasses the complete chronological and thematic scope of the text.",
  },
];

// ============================================================================
// SECTION 2: LISTENING (40 QUESTIONS, 4 SECTIONS, 30 MINUTES)
// Standard Cambridge IELTS 18 — Test 1 (Listening)
// ============================================================================

export const IELTS_18_LISTENING_QUESTIONS: IeltsQuestion[] = [
  // --------------------------------------------------------------------------
  // LISTENING SECTION 1: Social Conversation (Booking a Venue) (Q1–Q10)
  // --------------------------------------------------------------------------
  {
    id: "ielts-18-1-l-q1",
    questionNumber: 1,
    sectionNumber: 1,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 6,
    targetBandScore: 6.0,
    audioTranscript:
      "Clerk: Good morning, Highfield Community Centre, Sarah speaking. How may I help you?\nCaller: Hello Sarah. I'm calling to inquire about hiring one of your function rooms for an anniversary celebration next month. Around fifty guests are expected.\nClerk: Certainly! We have our Oak Suite, which holds up to sixty people comfortably.",
    prompt: "What is the capacity of the Oak Suite recommended by Sarah?",
    options: {
      A: "Up to 40 people.",
      B: "Up to 50 people.",
      C: "Up to 60 people.",
      D: "Up to 100 people.",
    },
    correctOption: "C",
    explanation: "Sarah states: 'We have our Oak Suite, which holds up to sixty people comfortably.'",
    trapAnalysis: "50 is the expected guest count, but 60 is the actual room capacity.",
  },
  {
    id: "ielts-18-1-l-q2",
    questionNumber: 2,
    sectionNumber: 1,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 6,
    targetBandScore: 6.0,
    audioTranscript:
      "Caller: That sounds ideal. What is the hourly rate for the Oak Suite on Saturday evenings?\nClerk: On Saturday evenings, the standard rate is thirty-five pounds per hour. However, if you book for four hours or longer, we apply a discounted package of thirty pounds per hour.",
    prompt: "What is the discounted hourly rate for bookings of four hours or more?",
    options: {
      A: "£25 per hour.",
      B: "£30 per hour.",
      C: "£35 per hour.",
      D: "£40 per hour.",
    },
    correctOption: "B",
    explanation: "Sarah says: 'if you book for four hours or longer, we apply a discounted package of thirty pounds per hour.'",
    trapAnalysis: "£35 is the standard rate; £30 is the discounted rate.",
  },
  {
    id: "ielts-18-1-l-q3",
    questionNumber: 3,
    sectionNumber: 1,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 6,
    targetBandScore: 6.5,
    audioTranscript:
      "Caller: Excellent. Are kitchen facilities included for self-catering, or must we hire your in-house caterer?\nClerk: You are very welcome to bring your own cold buffet. If you need our commercial reheating ovens and dishwasher, there is a one-off kitchen hire charge of twenty-five pounds.",
    prompt: "How much is the kitchen fee if the client uses the commercial reheating equipment?",
    options: {
      A: "Free of charge.",
      B: "£15.",
      C: "£25.",
      D: "£50.",
    },
    correctOption: "C",
    explanation: "'there is a one-off kitchen hire charge of twenty-five pounds.'",
    trapAnalysis: "Cold buffet is free, but using ovens costs £25.",
  },
  {
    id: "ielts-18-1-l-q4",
    questionNumber: 4,
    sectionNumber: 1,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 6,
    targetBandScore: 6.5,
    audioTranscript:
      "Caller: That's very reasonable. And what about music? Can we have an acoustic guitarist or DJ?\nClerk: Live acoustic music is permitted until ten-thirty in the evening. After that, music must cease to respect our residential neighbors.",
    prompt: "At what time must live music stop at the community centre?",
    options: {
      A: "21:30 (9:30 pm).",
      B: "22:00 (10:00 pm).",
      C: "22:30 (10:30 pm).",
      D: "23:00 (11:00 pm).",
    },
    correctOption: "C",
    explanation: "'Live acoustic music is permitted until ten-thirty in the evening.'",
    trapAnalysis: "10:30 pm is the firm cutoff time.",
  },
  {
    id: "ielts-18-1-l-q5",
    questionNumber: 5,
    sectionNumber: 1,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 7,
    targetBandScore: 7.0,
    audioTranscript:
      "Caller: Perfect. What is the deposit requirement to secure the reservation?\nClerk: We require a refundable security deposit of fifty pounds, plus a twenty percent advance payment of the total room fee.",
    prompt: "What refundable security deposit is required?",
    options: {
      A: "£20.",
      B: "£50.",
      C: "£100.",
      D: "£150.",
    },
    correctOption: "B",
    explanation: "'We require a refundable security deposit of fifty pounds.'",
    trapAnalysis: "20% is the advance room payment, £50 is the deposit.",
  },
  {
    id: "ielts-18-1-l-q6",
    questionNumber: 6,
    sectionNumber: 1,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 7,
    targetBandScore: 7.0,
    audioTranscript:
      "Clerk: May I take your full name and contact number, please?\nCaller: Yes, it's David Harrison. H-A-R-R-I-S-O-N. Phone number is 07700 900462.",
    prompt: "What is the caller's last name?",
    options: {
      A: "Harrington.",
      B: "Harrison.",
      C: "Harlow.",
      D: "Harris.",
    },
    correctOption: "B",
    explanation: "The caller spells his name: 'H-A-R-R-I-S-O-N'.",
    trapAnalysis: "Pay close attention to standard IELTS spelling tasks.",
  },
  {
    id: "ielts-18-1-l-q7",
    questionNumber: 7,
    sectionNumber: 1,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 7,
    targetBandScore: 7.0,
    audioTranscript:
      "Clerk: And what date are you looking at, Mr. Harrison?\nCaller: Saturday, the eighteenth of November. From six pm until eleven pm.",
    prompt: "Which date has been requested for the booking?",
    options: {
      A: "Saturday, 8th November.",
      B: "Saturday, 18th November.",
      C: "Saturday, 28th November.",
      D: "Sunday, 18th November.",
    },
    correctOption: "B",
    explanation: "'Saturday, the eighteenth of November.'",
    trapAnalysis: "18th vs 8th acoustic confusion.",
  },
  {
    id: "ielts-18-1-l-q8",
    questionNumber: 8,
    sectionNumber: 1,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 7,
    targetBandScore: 7.0,
    audioTranscript:
      "Clerk: And will you require audio-visual equipment, like our projector and screen?\nCaller: Just the microphone and wireless soundbar for speeches, please. We don't need the projector.",
    prompt: "Which AV equipment does the customer request?",
    options: {
      A: "Projector and screen.",
      B: "Microphone and wireless soundbar.",
      C: "Stage lighting array.",
      D: "No equipment whatsoever.",
    },
    correctOption: "B",
    explanation: "'Just the microphone and wireless soundbar for speeches, please.'",
    trapAnalysis: "He explicitly declines the projector.",
  },
  {
    id: "ielts-18-1-l-q9",
    questionNumber: 9,
    sectionNumber: 1,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 7,
    targetBandScore: 7.5,
    audioTranscript:
      "Clerk: Noted. Parking is available at the rear of the building. We have space for thirty-two vehicles, including two designated disabled parking bays.",
    prompt: "How many total parking spaces are available behind the venue?",
    options: {
      A: "20 vehicles.",
      B: "30 vehicles.",
      C: "32 vehicles.",
      D: "50 vehicles.",
    },
    correctOption: "C",
    explanation: "'We have space for thirty-two vehicles.'",
    trapAnalysis: "32 total, with 2 disabled bays.",
  },
  {
    id: "ielts-18-1-l-q10",
    questionNumber: 10,
    sectionNumber: 1,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 7,
    targetBandScore: 7.5,
    audioTranscript:
      "Clerk: I'll email you the booking contract right now. You can finalize confirmation by signing online within three business days.\nCaller: Many thanks, Sarah. Have a lovely day!",
    prompt: "How soon must the customer sign the contract online?",
    options: {
      A: "Within 24 hours.",
      B: "Within 3 business days.",
      C: "Within 7 working days.",
      D: "On the day of the event.",
    },
    correctOption: "B",
    explanation: "'You can finalize confirmation by signing online within three business days.'",
    trapAnalysis: "3 business days = 72 working hours.",
  },

  // --------------------------------------------------------------------------
  // LISTENING SECTION 2: Monologue (Park Guide & Local Amenities) (Q11–Q20)
  // --------------------------------------------------------------------------
  {
    id: "ielts-18-1-l-q11",
    questionNumber: 11,
    sectionNumber: 2,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 7,
    targetBandScore: 7.5,
    audioTranscript:
      "Guide: Welcome to the Riverside Heritage Park visitor briefing. Originally developed in the 1880s as a Victorian timber trading yard, the area was revitalized in 2004 thanks to National Lottery Heritage funding.",
    prompt: "When was Riverside Park transformed from its industrial origin into a public heritage space?",
    options: {
      A: "In the 1880s.",
      B: "In 1984.",
      C: "In 2004.",
      D: "In 2020.",
    },
    correctOption: "C",
    explanation: "'the area was revitalized in 2004 thanks to National Lottery Heritage funding.'",
    trapAnalysis: "1880s was its creation as a timber yard; 2004 was the public revitalization.",
  },
  {
    id: "ielts-18-1-l-q12",
    questionNumber: 12,
    sectionNumber: 2,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 7,
    targetBandScore: 7.5,
    audioTranscript:
      "Guide: If you take the Western Meadow Trail, you'll reach the sensory botanical garden. It features over eighty varieties of medicinal herbs, each equipped with tactile braille labeling and audio QR codes for visually impaired visitors.",
    prompt: "What special accessibility feature is installed in the sensory botanical garden?",
    options: {
      A: "Wheelchair-accessible golf carts.",
      B: "Tactile braille plaques and audio QR codes.",
      C: "Free guided sign-language tours every hour.",
      D: "Magnified glass viewing domes.",
    },
    correctOption: "B",
    explanation: "'equipped with tactile braille labeling and audio QR codes for visually impaired visitors.'",
    trapAnalysis: "Tactile braille and audio QR codes are explicitly mentioned.",
  },
  {
    id: "ielts-18-1-l-q13",
    questionNumber: 13,
    sectionNumber: 2,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 7,
    targetBandScore: 7.5,
    audioTranscript:
      "Guide: For families with younger children, the Adventure Timber Playground is open daily from sunrise to sunset. Please note that dogs, even on short leashes, are not permitted inside the fenced playground boundary.",
    prompt: "What rule applies strictly to the children's playground?",
    options: {
      A: "Children must wear helmets on climbing equipment.",
      B: "Dogs are prohibited from entering the fenced area.",
      C: "Admission tickets cost £3 per child.",
      D: "It closes at 16:00 every afternoon.",
    },
    correctOption: "B",
    explanation: "'dogs, even on short leashes, are not permitted inside the fenced playground boundary.'",
    trapAnalysis: "Leashed or unleashed, dogs are forbidden inside the fence.",
  },
  {
    id: "ielts-18-1-l-q14",
    questionNumber: 14,
    sectionNumber: 2,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 8,
    targetBandScore: 8.0,
    audioTranscript:
      "Guide: Our organic Riverside Cafe is situated inside the former boat engine shed. All proceeds from the cafe directly subsidize our seasonal wetlands restoration program.",
    prompt: "Where do the profits from the Riverside Cafe go?",
    options: {
      A: "To pay commercial dividend shares to investors.",
      B: "To fund the local wetlands environmental restoration project.",
      C: "To buy new motorboats for the council.",
      D: "To subsidize tourist bus tickets.",
    },
    correctOption: "B",
    explanation: "'All proceeds from the cafe directly subsidize our seasonal wetlands restoration program.'",
    trapAnalysis: "Proceeds = profits; subsidize = fund.",
  },
  {
    id: "ielts-18-1-l-q15",
    questionNumber: 15,
    sectionNumber: 2,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 8,
    targetBandScore: 8.0,
    audioTranscript:
      "Guide: For cycling enthusiasts, our paved loop connects directly to National Cycle Network Route 4. Bike hire is available next to the visitor centre for eight pounds for two hours, including high-visibility vests and locks.",
    prompt: "How much does a two-hour bicycle hire cost?",
    options: {
      A: "£5.",
      B: "£8.",
      C: "£12.",
      D: "£16.",
    },
    correctOption: "B",
    explanation: "'Bike hire is available... for eight pounds for two hours.'",
    trapAnalysis: "£8 for 2 hours.",
  },
  {
    id: "ielts-18-1-l-q16",
    questionNumber: 16,
    sectionNumber: 2,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 8,
    targetBandScore: 8.0,
    audioTranscript:
      "Guide: In the event of adverse weather or high river flood warnings, our digital sirens sound three continuous chimes. Visitors must then make their way toward the upper eastern car park at high elevation.",
    prompt: "What emergency action must visitors take when flood sirens chime?",
    options: {
      A: "Shelter inside the boat engine shed.",
      B: "Board the emergency rescue ferry.",
      C: "Evacuate toward the elevated upper eastern car park.",
      D: "Wait at the playground until park rangers arrive.",
    },
    correctOption: "C",
    explanation: "'Visitors must then make their way toward the upper eastern car park at high elevation.'",
    trapAnalysis: "High elevation car park is the designated safe gathering point.",
  },
  {
    id: "ielts-18-1-l-q17",
    questionNumber: 17,
    sectionNumber: 2,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 8,
    targetBandScore: 8.0,
    audioTranscript:
      "Guide: Every Wednesday morning at ten o'clock, our resident ecologist leads a free birdwatching walk. You're likely to spot kingfishers, grey herons, and our nesting peregrine falcons on the old clock tower.",
    prompt: "Which day of the week does the ecologist lead the birdwatching tour?",
    options: {
      A: "Monday mornings.",
      B: "Wednesday mornings.",
      C: "Friday afternoons.",
      D: "Saturday mornings.",
    },
    correctOption: "B",
    explanation: "'Every Wednesday morning at ten o'clock, our resident ecologist leads a free birdwatching walk.'",
    trapAnalysis: "Wednesday mornings at 10:00.",
  },
  {
    id: "ielts-18-1-l-q18",
    questionNumber: 18,
    sectionNumber: 2,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 8,
    targetBandScore: 8.5,
    audioTranscript:
      "Guide: Photography permits are required only for commercial film crews using heavy tripods or drones. Handheld amateur cameras and smartphones are completely unrestricted throughout the grounds.",
    prompt: "When is a photography permit required in the park?",
    options: {
      A: "For any visitor taking portraits.",
      B: "For commercial filming involving drones or heavy tripods.",
      C: "For pictures taken after sunset.",
      D: "Permits are mandatory for all visitors taking photos.",
    },
    correctOption: "B",
    explanation: "'Photography permits are required only for commercial film crews using heavy tripods or drones.'",
    trapAnalysis: "Amateur and smartphone photos are completely free and unrestricted.",
  },
  {
    id: "ielts-18-1-l-q19",
    questionNumber: 19,
    sectionNumber: 2,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 8,
    targetBandScore: 8.5,
    audioTranscript:
      "Guide: Please note that our historical lime kilns located along the northern cliff are undergoing stone stabilization works. That entire cliff section is barricaded and scheduled to reopen next April.",
    prompt: "Why is the northern cliff section around the lime kilns currently closed?",
    options: {
      A: "Severe flooding from the river.",
      B: "Excavation of Roman archaeological remains.",
      C: "Masonry and stone stabilization maintenance.",
      D: "Construction of a new restaurant.",
    },
    correctOption: "C",
    explanation: "'historical lime kilns... are undergoing stone stabilization works.'",
    trapAnalysis: "Stone stabilization = masonry repair.",
  },
  {
    id: "ielts-18-1-l-q20",
    questionNumber: 20,
    sectionNumber: 2,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 8,
    targetBandScore: 8.5,
    audioTranscript:
      "Guide: Finally, if you lose personal items during your visit, our lost-and-found repository is located right inside the ranger station next to the main gate. Items are retained for thirty days before being donated to local charities.",
    prompt: "How long does the ranger station keep unclaimed lost items?",
    options: {
      A: "Seven days.",
      B: "Fourteen days.",
      C: "Thirty days.",
      D: "Ninety days.",
    },
    correctOption: "C",
    explanation: "'Items are retained for thirty days before being donated to local charities.'",
    trapAnalysis: "30 days before donation.",
  },

  // --------------------------------------------------------------------------
  // LISTENING SECTION 3: Study Group Discussion (Renewable Energy) (Q21–Q30)
  // --------------------------------------------------------------------------
  {
    id: "ielts-18-1-l-q21",
    questionNumber: 21,
    sectionNumber: 3,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 8,
    targetBandScore: 8.0,
    audioTranscript:
      "Dr. Evans: Welcome, Emma and Liam. Today we're reviewing your draft proposal on decentralized community solar microgrids in suburban housing estates. Emma, what sparked your focus on battery storage rather than solar panel efficiency?\nEmma: Well, Dr. Evans, efficiency gains in photovoltaic silicon cells have plateaued around twenty-two percent. The real economic bottleneck now is diurnal load shifting—storing daytime surplus for evening peak consumption.",
    prompt: "Why did Emma choose to focus on battery storage over solar panel efficiency?",
    options: {
      A: "Silicon solar panels are too expensive to manufacture locally.",
      B: "Solar cell efficiency improvements have largely plateaued, making storage the key challenge.",
      C: "Government grants only fund lithium-ion battery installations.",
      D: "Suburban homes do not have sufficient roof space for solar panels.",
    },
    correctOption: "B",
    explanation: "Emma points out that solar cell efficiency gains 'have plateaued around twenty-two percent. The real economic bottleneck now is diurnal load shifting'.",
    trapAnalysis: "Plateaued = leveled off with diminishing returns.",
  },
  {
    id: "ielts-18-1-l-q22",
    questionNumber: 22,
    sectionNumber: 3,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 8,
    targetBandScore: 8.0,
    audioTranscript:
      "Liam: Exactly. And when we surveyed residents in the Westgate estate, sixty-four percent stated that high upfront capital cost was their primary barrier to adoption, far exceeding concerns about aesthetics or roof warranty.\nDr. Evans: That's a striking finding. Did you investigate collective leasing models to mitigate that initial expenditure?",
    prompt: "What was the foremost concern reported by Westgate residents in the survey?",
    options: {
      A: "Visual aesthetics of roof-mounted panels.",
      B: "High initial capital purchase costs.",
      C: "Fire risk associated with lithium batteries.",
      D: "Disruption to internet connection signals.",
    },
    correctOption: "B",
    explanation: "Liam confirms: 'sixty-four percent stated that high upfront capital cost was their primary barrier to adoption.'",
    trapAnalysis: "Upfront capital cost = initial purchase expenditure.",
  },
  {
    id: "ielts-18-1-l-q23",
    questionNumber: 23,
    sectionNumber: 3,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 8,
    targetBandScore: 8.5,
    audioTranscript:
      "Emma: Yes, we looked at community energy cooperatives where a municipal trust finances the battery installation, and participating households repay the investment through a discounted tariff over ten years.\nDr. Evans: That's promising, but how do you address the 'free-rider' dilemma where non-investing neighbors benefit from grid stability?",
    prompt: "How does the proposed cooperative model fund the battery system?",
    options: {
      A: "Through an unconditional donation from multinational oil companies.",
      B: "Via a municipal trust that recovers funds through a 10-year discounted electricity tariff.",
      C: "By charging homeowners a compulsory annual council tax surcharge.",
      D: "Through crowdfunding on social media platforms.",
    },
    correctOption: "B",
    explanation: "Emma explains: 'a municipal trust finances the battery installation, and participating households repay... through a discounted tariff over ten years.'",
    trapAnalysis: "Municipal trust financing with 10-year recovery.",
  },
  {
    id: "ielts-18-1-l-q24",
    questionNumber: 24,
    sectionNumber: 3,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 8,
    targetBandScore: 8.5,
    audioTranscript:
      "Liam: We analyzed smart meters equipped with peer-to-peer blockchain validation. Energy traded within the local microgrid is verified cryptographically, ensuring only contributing households receive credit tokens.\nDr. Evans: Intriguing, though make sure your methodology chapter addresses cybersecurity risks and computational overhead.",
    prompt: "What mechanism does Liam propose to ensure fair accounting of traded electricity?",
    options: {
      A: "Manual meter readings carried out by local volunteer wardens.",
      B: "Blockchain-verified smart meters distributing digital credit tokens.",
      C: "Flat monthly electricity bills split equally among all residents.",
      D: "An analog circuit breaker installed at each transformer.",
    },
    correctOption: "B",
    explanation: "'smart meters equipped with peer-to-peer blockchain validation. Energy traded... is verified cryptographically, ensuring only contributing households receive credit tokens.'",
    trapAnalysis: "Blockchain tokenization ensures algorithmic fairness.",
  },
  {
    id: "ielts-18-1-l-q25",
    questionNumber: 25,
    sectionNumber: 3,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 9,
    targetBandScore: 8.5,
    audioTranscript:
      "Emma: Regarding battery chemistry, we initially opted for standard lithium iron phosphate, or LFP. But our lifecycle analysis revealed that sodium-ion cells, while slightly heavier, completely eliminate ethical cobalt concerns and perform far better in sub-zero winter temperatures.\nDr. Evans: Excellent pivot. Sodium-ion is gaining massive traction for stationary storage where volumetric energy density is secondary to cost and supply chain resilience.",
    prompt: "Why did Emma and Liam substitute sodium-ion batteries for lithium iron phosphate?",
    options: {
      A: "Sodium-ion batteries are much lighter and easier to carry up ladders.",
      B: "They avoid ethical cobalt sourcing issues and maintain performance in freezing winter conditions.",
      C: "They can be manufactured directly from ocean seawater on kitchen tables.",
      D: "Government legislation has made all lithium chemistries illegal.",
    },
    correctOption: "B",
    explanation: "Emma points out sodium-ion 'completely eliminate ethical cobalt concerns and perform far better in sub-zero winter temperatures.'",
    trapAnalysis: "Sub-zero temperatures + ethical cobalt elimination.",
  },
  {
    id: "ielts-18-1-l-q26",
    questionNumber: 26,
    sectionNumber: 3,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 9,
    targetBandScore: 8.5,
    audioTranscript:
      "Liam: For the pilot cohort, we chose forty terraced properties on Northcote Avenue because they share a single secondary substation transformer, isolating our telemetry from the broader regional grid.\nDr. Evans: That will simplify your statistical boundary controls significantly.",
    prompt: "Why was Northcote Avenue selected for the empirical pilot study?",
    options: {
      A: "It houses the university's engineering faculty professors.",
      B: "All forty houses share one secondary transformer, providing isolated telemetry.",
      C: "It is the sunniest street in the city with no trees.",
      D: "Residents were promised free electric vehicles.",
    },
    correctOption: "B",
    explanation: "Liam explains: 'they share a single secondary substation transformer, isolating our telemetry from the broader regional grid.'",
    trapAnalysis: "Single transformer allows controlled statistical boundary isolation.",
  },
  {
    id: "ielts-18-1-l-q27",
    questionNumber: 27,
    sectionNumber: 3,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 9,
    targetBandScore: 9.0,
    audioTranscript:
      "Dr. Evans: What about the regulatory hurdles with the Distribution Network Operator, Western Power?\nEmma: That proved the thorniest obstacle. Under current distribution code, exporting power across public thoroughfares requires an independent supplier license, which costs roughly seventy thousand pounds in compliance audits.",
    prompt: "What major institutional barrier does Emma identify with the distribution operator?",
    options: {
      A: "Local power cables are too old to carry alternating current.",
      B: "Regulatory codes require an expensive supplier license to transmit power across public streets.",
      C: "The operator refuses to communicate with university researchers.",
      D: "The national grid is already running at 100% capacity.",
    },
    correctOption: "B",
    explanation: "Emma states: 'exporting power across public thoroughfares requires an independent supplier license, which costs roughly seventy thousand pounds in compliance audits.'",
    trapAnalysis: "Thoroughfares = public roads; licensing cost is the regulatory roadblock.",
  },
  {
    id: "ielts-18-1-l-q28",
    questionNumber: 28,
    sectionNumber: 3,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 9,
    targetBandScore: 9.0,
    audioTranscript:
      "Liam: We propose that the city council designate the pilot zone as an official 'Regulatory Sandbox', exempting the forty properties from licensing fees for twenty-four months while data is gathered for the energy regulator, Ofgem.",
    prompt: "What temporary solution does Liam advocate to bypass the licensing obstacle?",
    options: {
      A: "Operating the system illegally under cover of night.",
      B: "Securing a municipal 'Regulatory Sandbox' exemption for two years.",
      C: "Asking Ofgem to shut down all neighboring gas utilities.",
      D: "Running overhead extension cords through private attics.",
    },
    correctOption: "B",
    explanation: "Liam suggests designating it 'as an official Regulatory Sandbox, exempting the forty properties... for twenty-four months' (two years).",
    trapAnalysis: "Regulatory Sandbox = controlled exemption trial.",
  },
  {
    id: "ielts-18-1-l-q29",
    questionNumber: 29,
    sectionNumber: 3,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 9,
    targetBandScore: 9.0,
    audioTranscript:
      "Dr. Evans: That is a well-reasoned policy maneuver. Looking at your literature review, however, you've overlooked Martinez's 2022 landmark paper on thermal runaway risks in residential battery modules. You must incorporate that into your safety appendix.",
    prompt: "What critical gap does Dr. Evans instruct the students to address in their report?",
    options: {
      A: "Add calculations for wind turbine noise pollution.",
      B: "Incorporate Martinez's 2022 research on battery thermal runaway hazards.",
      C: "Interview local elementary school children about solar energy.",
      D: "Rewrite the introductory executive summary in German.",
    },
    correctOption: "B",
    explanation: "Dr. Evans insists: 'you've overlooked Martinez's 2022 landmark paper on thermal runaway risks in residential battery modules. You must incorporate that'.",
    trapAnalysis: "Thermal runaway = overheating fire risk.",
  },
  {
    id: "ielts-18-1-l-q30",
    questionNumber: 30,
    sectionNumber: 3,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 9,
    targetBandScore: 9.0,
    audioTranscript:
      "Dr. Evans: Finally, your final presentation is scheduled for Thursday the twelfth of May. Please upload your revised slide deck to the department server by noon on Wednesday the eleventh.\nEmma: Understood, Dr. Evans. Thank you for your guidance!",
    prompt: "When must the students submit their revised presentation slides?",
    options: {
      A: "Tuesday the 10th at midnight.",
      B: "Wednesday the 11th by 12:00 noon.",
      C: "Thursday the 12th at 09:00 am.",
      D: "Friday the 13th after the exam.",
    },
    correctOption: "B",
    explanation: "'upload your revised slide deck to the department server by noon on Wednesday the eleventh.'",
    trapAnalysis: "Submission deadline is noon on Wednesday 11th; presentation is on the 12th.",
  },

  // --------------------------------------------------------------------------
  // LISTENING SECTION 4: Academic Lecture (Cognitive Psychology) (Q31–Q40)
  // --------------------------------------------------------------------------
  {
    id: "ielts-18-1-l-q31",
    questionNumber: 31,
    sectionNumber: 4,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 9,
    targetBandScore: 8.5,
    audioTranscript:
      "Professor: In today's lecture on cognitive neuroscience, we explore the cellular architecture of sleep-dependent memory consolidation. For much of the twentieth century, sleep was dismissed as an inactive state of metabolic quiescence—merely a passive recovery period for somatic tissue repair.",
    prompt: "Throughout the twentieth century, how was sleep predominantly viewed in biological science?",
    options: {
      A: "As the primary phase when new creative connections are actively synthesized.",
      B: "As a passive, inactive state primarily intended for physical tissue rest.",
      C: "As an abnormal evolutionary byproduct of mammalian brain enlargement.",
      D: "As a dangerous neurochemical trance state requiring medical mitigation.",
    },
    correctOption: "B",
    explanation: "The professor states sleep was dismissed 'as an inactive state of metabolic quiescence—merely a passive recovery period for somatic tissue repair.'",
    trapAnalysis: "Passive recovery vs modern active neural consolidation view.",
  },
  {
    id: "ielts-18-1-l-q32",
    questionNumber: 32,
    sectionNumber: 4,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 9,
    targetBandScore: 8.5,
    audioTranscript:
      "Professor: Contemporary neuroimaging, however, reveals that the sleeping brain exhibits bursts of synchronized electrical choreography. During slow-wave non-REM sleep, the hippocampus engages in high-frequency neural replay, recapitulating waking firing sequences at roughly twenty times their original speed.",
    prompt: "At what rate does the hippocampus replay daytime neural firing patterns during deep slow-wave sleep?",
    options: {
      A: "At the exact same speed as real-time waking experience.",
      B: "At roughly twice the original speed.",
      C: "At approximately twenty times their original speed.",
      D: "In complete reverse order at half speed.",
    },
    correctOption: "C",
    explanation: "'the hippocampus engages in high-frequency neural replay, recapitulating waking firing sequences at roughly twenty times their original speed.'",
    trapAnalysis: "20x replay compression factor.",
  },
  {
    id: "ielts-18-1-l-q33",
    questionNumber: 33,
    sectionNumber: 4,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 9,
    targetBandScore: 9.0,
    audioTranscript:
      "Professor: This accelerated dialogue between the hippocampus—acting as a temporary, volatile cache—and the neocortex facilitates systems consolidation. Episodic traces are gradually transferred into long-term neocortical networks, shielding them from retroactive interference caused by subsequent daytime learning.",
    prompt: "What is the primary function of transferring memories from the hippocampus to the neocortex?",
    options: {
      A: "To completely erase emotional memories associated with trauma.",
      B: "To store traces in permanent cortical networks and shield them from interference.",
      C: "To convert visual memories into acoustic auditory files.",
      D: "To reduce total brain oxygen consumption during dreaming.",
    },
    correctOption: "B",
    explanation: "'Episodic traces are gradually transferred into long-term neocortical networks, shielding them from retroactive interference'.",
    trapAnalysis: "Shielding from retroactive interference is the core biological rationale.",
  },
  {
    id: "ielts-18-1-l-q34",
    questionNumber: 34,
    sectionNumber: 4,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 10,
    targetBandScore: 9.0,
    audioTranscript:
      "Professor: Crucial to this transfer are sleep spindles: brief bursts of oscillatory brain activity generated in the reticular thalamus, oscillating between eleven and sixteen Hertz. Spindle density measured via electroencephalogram directly correlates with post-sleep retention of declarative factual information.",
    prompt: "What brainwave pattern generated in the reticular thalamus correlates with declarative memory retention?",
    options: {
      A: "Delta waves.",
      B: "Sleep spindles (11–16 Hz).",
      C: "Alpha rhythms.",
      D: "Gamma synchrony.",
    },
    correctOption: "B",
    explanation: "'Crucial to this transfer are sleep spindles... oscillating between eleven and sixteen Hertz. Spindle density... directly correlates with post-sleep retention'.",
    trapAnalysis: "Sleep spindles are the explicit biomarker named by the lecturer.",
  },
  {
    id: "ielts-18-1-l-q35",
    questionNumber: 35,
    sectionNumber: 4,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 10,
    targetBandScore: 9.0,
    audioTranscript:
      "Professor: By contrast, Rapid Eye Movement (REM) sleep serves an entirely distinct cognitive purpose. Rather than cementing rote facts, REM sleep recalibrates emotional valence and facilitates associative integration. The brain strips away the visceral stress neurotransmitter noradrenaline while reactivating autobiographical episodes, effectively divorcing emotional memory from chronic affective distress.",
    prompt: "What neurochemical phenomenon occurs during REM sleep to process emotional experiences?",
    options: {
      A: "A massive surge in cortisol and adrenaline that triggers panic dreams.",
      B: "The suppression of noradrenaline, decoupling memory from visceral emotional distress.",
      C: "Complete inhibition of dopamine and serotonin.",
      D: "The destruction of long-term synaptic connections.",
    },
    correctOption: "B",
    explanation: "'The brain strips away the visceral stress neurotransmitter noradrenaline while reactivating autobiographical episodes, effectively divorcing emotional memory from chronic affective distress.'",
    trapAnalysis: "Noradrenaline is suppressed, neutralizing visceral trauma.",
  },
  {
    id: "ielts-18-1-l-q36",
    questionNumber: 36,
    sectionNumber: 4,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 10,
    targetBandScore: 9.0,
    audioTranscript:
      "Professor: This REM-dependent associative processing explains the phenomenon often termed 'sleeping on a problem'. In sleep laboratory experiments, participants subjected to complex logic puzzles are three times more likely to divine implicit structural shortcuts after a full night of sleep that includes normal REM cycles, compared to a control group kept awake for an identical duration.",
    prompt: "What did laboratory studies demonstrate regarding subjects attempting complex problem-solving after sleep?",
    options: {
      A: "They solved puzzles at the exact same rate as sleep-deprived subjects.",
      B: "They were three times more likely to identify hidden structural shortcuts.",
      C: "They forgot the rules of the logic puzzle entirely.",
      D: "They became overly frustrated and abandoned testing.",
    },
    correctOption: "B",
    explanation: "'participants... are three times more likely to divine implicit structural shortcuts after a full night of sleep that includes normal REM cycles'.",
    trapAnalysis: "Threefold increase in discovering hidden structural shortcuts.",
  },
  {
    id: "ielts-18-1-l-q37",
    questionNumber: 37,
    sectionNumber: 4,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 10,
    targetBandScore: 9.0,
    audioTranscript:
      "Professor: In aging populations, however, this delicate architecture suffers severe degradation. By age sixty-five, the amplitude of slow-wave sleep diminishes by up to seventy percent due to structural atrophy in the medial prefrontal cortex. This deficit directly mirrors age-related declines in episodic memory retention.",
    prompt: "By age 65, what neurological alteration accounts for up to a 70% reduction in slow-wave sleep?",
    options: {
      A: "Blockage of the carotid blood vessels.",
      B: "Structural atrophy within the medial prefrontal cortex.",
      C: "The complete cessation of melatonin production in the pineal gland.",
      D: "Excessive buildup of spinal fluid in the temporal lobes.",
    },
    correctOption: "B",
    explanation: "'slow-wave sleep diminishes by up to seventy percent due to structural atrophy in the medial prefrontal cortex.'",
    trapAnalysis: "Medial prefrontal cortex atrophy causes the drop in slow-wave amplitude.",
  },
  {
    id: "ielts-18-1-l-q38",
    questionNumber: 38,
    sectionNumber: 4,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 10,
    targetBandScore: 9.0,
    audioTranscript:
      "Professor: Pharmacological hypnotics, such as classical benzodiazepines or Z-drugs, do not restore restorative sleep architecture. While they induce sedation, they fundamentally blunt both slow-wave oscillation power and sleep spindle frequencies, producing a neuroelectric signature that mimics anesthesia rather than restorative natural slumber.",
    prompt: "How do prescription sleeping pills (benzodiazepines) impact natural brainwave architecture?",
    options: {
      A: "They double the density of beneficial sleep spindles.",
      B: "They induce sedation while blunting slow waves and spindles, mimicking anesthesia.",
      C: "They eliminate all dreaming without altering slow-wave power.",
      D: "They cure age-related memory deterioration within days.",
    },
    correctOption: "B",
    explanation: "'While they induce sedation, they fundamentally blunt both slow-wave oscillation power and sleep spindle frequencies, producing a neuroelectric signature that mimics anesthesia'.",
    trapAnalysis: "Sedation != natural sleep; pills blunt restorative slow waves and spindles.",
  },
  {
    id: "ielts-18-1-l-q39",
    questionNumber: 39,
    sectionNumber: 4,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 10,
    targetBandScore: 9.0,
    audioTranscript:
      "Professor: Promising non-pharmacological interventions are emerging instead. Transcranial electrical stimulation, timed precisely to slow-wave peaks via closed-loop acoustic stimulation, has successfully amplified slow-wave amplitude in clinical trials, boosting memory recall by nearly twenty-six percent in healthy older adults.",
    prompt: "What outcome was achieved using closed-loop acoustic stimulation timed to slow waves in elderly trials?",
    options: {
      A: "A 26% improvement in memory recall performance.",
      B: "Total restoration of hearing loss in senior patients.",
      C: "A 50% reduction in daytime calorie consumption.",
      D: "Elimination of all chronic migraine headaches.",
    },
    correctOption: "A",
    explanation: "'amplified slow-wave amplitude in clinical trials, boosting memory recall by nearly twenty-six percent in healthy older adults.'",
    trapAnalysis: "26% memory recall gain in trials.",
  },
  {
    id: "ielts-18-1-l-q40",
    questionNumber: 40,
    sectionNumber: 4,
    ieltsType: "multiple_choice",
    nclcTargetLevel: 10,
    targetBandScore: 9.0,
    audioTranscript:
      "Professor: In conclusion, sleep is neither a dispensable luxury nor a passive metabolic void. It is an intensely active, evolutionarily conserved neurological program that sculpts our synaptic landscapes, cures emotional fractures, and constructs our persistent sense of personal identity. Next week, we turn our attention to neurodegenerative tau pathology. Thank you.",
    prompt: "What overarching conclusion does the lecturer present regarding the evolutionary role of sleep?",
    options: {
      A: "Sleep is an obsolete evolutionary relic that modern humans should genetically shorten.",
      B: "Sleep is an active, conserved program vital for neural sculpting, emotional repair, and personal identity.",
      C: "Sleep matters only during early childhood development and has no adult utility.",
      D: "Artificial intelligence will replace the biological need for human sleep within a decade.",
    },
    correctOption: "B",
    explanation: "The lecturer concludes: 'sleep is neither a dispensable luxury nor a passive metabolic void. It is an intensely active, evolutionarily conserved neurological program that sculpts our synaptic landscapes, cures emotional fractures, and constructs our persistent sense of personal identity.'",
    trapAnalysis: "B is an exact summary of the concluding synthesis.",
  },
];

// ============================================================================
// SECTION 3: WRITING (TASK 1 & TASK 2, 60 MINUTES)
// Standard Cambridge IELTS 18 General Training
// ============================================================================

export const IELTS_18_WRITING_TASKS = {
  task1: {
    type: "letter" as const,
    minWords: 150 as const,
    situation:
      "You recently moved into a new residential neighborhood and noticed that local public bus services on your route have been reduced unexpectedly, causing inconvenience for commuters and students.",
    prompt:
      "Write a formal letter to the director of the regional public transport authority.\n\nIn your letter:\n• Explain who you are and describe the current bus service situation in your area.\n• Outline the specific problems caused by the recent reduction in service frequency.\n• Propose constructive solutions or alternative adjustments the council should implement.",
    bulletPoints: [
      "Introduce yourself and detail your neighborhood bus route.",
      "Explain the impact on workers, seniors, and school students.",
      "Suggest viable timetable adjustments or peak-hour express services.",
    ],
  },
  task2: {
    type: "essay" as const,
    minWords: 250 as const,
    topic:
      "Some people believe that artificial intelligence and automation in the workplace will inevitably cause widespread unemployment and should be strictly regulated by government quotas. Others argue that AI will generate new, higher-quality industries and should be allowed to develop freely.",
    prompt:
      "Discuss both views and give your own opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.",
  },
};

// ============================================================================
// SECTION 4: SPEAKING (3 PARTS, 11 TO 14 MINUTES)
// Standard Cambridge IELTS 18 General Training
// ============================================================================

export const IELTS_18_SPEAKING_TASKS = {
  part1: {
    topic: "Hometown, Work/Study & Leisure Habits",
    questions: [
      "Let's talk about where you live. Do you live in a house or an apartment?",
      "What do you enjoy most about your current neighborhood?",
      "Do you prefer studying or working alone, or as part of a team? Why?",
      "How do you usually unwind and spend your free time on weekends?",
    ],
  },
  part2: {
    cueCardTopic: "Describe an ambitious challenge or project you successfully completed",
    bulletPoints: [
      "What the challenge or project was",
      "When and where you took on this challenge",
      "What obstacles you faced along the way and how you overcame them",
      "And explain why achieving this outcome was personally significant to you",
    ],
    prepSeconds: 60 as const,
    speechSeconds: 120 as const,
  },
  part3: {
    theme: "Ambition, Modern Resilience & Technological Stress",
    questions: [
      "Do you believe that young people today face greater pressure to succeed compared to previous generations?",
      "In what ways can employers foster genuine resilience in their workforce without causing burnout?",
      "Some people claim that modern digital connectivity makes it impossible to achieve true work-life balance. To what extent do you agree?",
      "How important is it for a society to celebrate failure as a stepping stone to innovation?",
    ],
  },
};

// ============================================================================
// FULL SERIES EXPORTS (READING & LISTENING INDIVIDUAL + COMPREHENSIVE IELTS DATA)
// ============================================================================

export const FULL_SERIES_IELTS_GEN_18_1_READING: ExamSeriesData = {
  id: "ielts-gen-18-1-ce",
  seriesNumber: 301,
  title: "Cambridge IELTS 18 — General Reading Test 1",
  discipline: "CE",
  durationSeconds: 60 * 60, // 60 minutes
  questions: IELTS_18_READING_QUESTIONS,
};

export const FULL_SERIES_IELTS_GEN_18_1_LISTENING: ExamSeriesData = {
  id: "ielts-gen-18-1-co",
  seriesNumber: 301,
  title: "Cambridge IELTS 18 — General Listening Test 1",
  discipline: "CO",
  durationSeconds: 30 * 60, // 30 minutes
  questions: IELTS_18_LISTENING_QUESTIONS,
};

export const FULL_SERIES_IELTS_GEN_18_1: IeltsSeriesData = {
  id: "ielts-gen-18-1",
  seriesNumber: 301,
  testType: "ielts",
  track: "general",
  edition: "Cambridge IELTS 18",
  testNumber: 1,
  title: "IELTS General 18 — Test 1 (Standard Cambridge)",
  discipline: "CE", // Default primary discipline
  durationSeconds: 60 * 60,
  questions: IELTS_18_READING_QUESTIONS,
  writingTasks: IELTS_18_WRITING_TASKS,
  speakingTasks: IELTS_18_SPEAKING_TASKS,
};
