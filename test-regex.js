const text = `[[LEAD_DATA:{"name": "جمال سليم", "phone": "01154254236", "preferredTime": "بكرة بعد العشاء", "activity": null, "service": "WhatsApp API"}]]`;
const match = text.match(/\[\[LEAD_DATA:\s*({[\s\S]*?})\s*\]\]/);
console.log(match ? match[1] : 'No match');
