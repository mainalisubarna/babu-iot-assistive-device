# Babu — Nepali AI Companion (Hackathon Q&A)

---

## 1) Why didn’t you make this as a mobile app instead of a dedicated Raspberry Pi device?

We wanted to get rid of any complexities of using a device. A mobile app would limit access to device features and make certain interactions impractical. For elderly users, pressing buttons or opening apps is intimidating. Speaking consecutive words is far simpler and more natural for them.

---

## 2) How is Babu different from other voice assistants like Gemini, Alexa, or Google Home?

Other voice assistants don’t support Nepali language or local date formats (miti/tithi). Babu is purpose-built for Nepali elders, providing Nepali news, events, and local context. Unlike tech giants, we focus on a niche market with large potential that is often overlooked.

---

## 3) How much does it cost you to make one unit of Babu?

**Final cost estimate:**

| Component                         | Cost                  |
|----------------------------------|----------------------|
| Raspberry Pi Zero 2 W            | ₹1,482 INR ≈ ₨ 2,371 NPR |
| 5 MP Camera Module               | ₹300 INR ≈ ₨ 480 NPR |
| SIM800L GSM Module               | ₹625 INR ≈ ₨ 1,000 NPR |
| Batteries (2 × cells)            | ₨ 400 NPR             |
| Speaker + PAM amplifier setup    | ₨ 100 NPR             |

**Total ≈ ₨ 4,351 NPR**  
This keeps the device affordable while delivering all core functionality.

---

## 4) How do you plan on expanding Babu beyond this hackathon version?

We plan to mass-produce Babu using a simplified PCB that integrates the Pi compute module, GSM, audio amp, and power management onto a single board. Extra modules and connectors will be removed to reduce cost and assembly complexity.  
We aim to distribute Babu to elder homes, rural health posts, and urban households. Based on user feedback, we will prioritize either companionship or healthcare features, refining the hardware and software accordingly.

---

## 5) If someone like Google or Amazon adds Nepali support to their assistants, what stops them from taking your market?

Even if Google or Amazon add Nepali support, Babu solves challenges they don’t:  
1. **Cultural fit & ultra-simple UX** – Tailored responses, Nepali dates/tithi, and offline-first operation.  
2. **Hardware independence** – Built-in GSM, no Wi-Fi or smartphone required.  
3. **Market depth** – Trust and adoption in a niche market via caregivers and local distribution, creating early brand loyalty.

---

## 6) What are the key technical challenges you faced, and how did you solve them?

Initially, we planned a large feature set and a premium omni-directional microphone. However, our Pi soundcard only supported mono audio. We adapted by using a standard earphone microphone, keeping costs low while maintaining core functionality. This demonstrated our ability to make practical trade-offs under time pressure.

---

## 7) If you win funding, what’s your next immediate step?

We will work with Chinese custom PCB manufacturers to produce a first iteration of Babu. This allows streamlined hardware, lower assembly complexity, and reduced costs. Simultaneously, we will pilot-test the device with target users to refine both software and hardware for real-world deployment.

---

## 8) How do you ensure the elderly will actually use Babu and not abandon it?

We ensure adoption through simplicity, accessibility, and immediate value:  
1. **Voice-first interaction** – No screens or buttons; elders just speak in Nepali.  
2. **Relevant features** – Medicine reminders, news, local events, and companionship.  
3. **Caregiver involvement** – Setup and curation by family or caregivers.  
4. **Trust-building via local distribution** – Hands-on experience in elder homes builds confidence.  

By focusing on practical utility and minimal friction, we make it easy for elders to adopt and continue using Babu.
