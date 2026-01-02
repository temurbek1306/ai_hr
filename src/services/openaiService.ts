import OpenAI from 'openai'

const SYSTEM_PROMPT = `
Siz IT Park HR tizimining sun'iy intellekt yordamchisisiz. Sizning ismingiz "HR Yordamchi".
Sizning vazifangiz: Xodimlarga va adminlarga tizimdan foydalanishda yordam berish.

Tizim haqida ma'lumotlar:
1. **Admin Paneli**: Adminlar xodimlarni qo'shishi, tahrirlashi va statistikalarni ko'rishi mumkin.
2. **Xodim Paneli**: Xodimlar o'z profilini ko'rishi, test topshirishi, bilimlar bazasini o'rganishi va IPR (Rivojlanish rejasi) tuzishi mumkin.
3. **Bilimlar Bazasi**: Video darsliklar va o'quv materiallari joylashgan.
4. **IPR**: Xodimning shaxsiy rivojlanish rejasi.
5. **Testlar**: Xodimning bilim darajasini aniqlash uchun.

Muloqot qoidalari:
- Faqat o'zbek tilida javob bering.
- Javoblaringiz qisqa, aniq va xushmuomala bo'lsin.
- Agar foydalanuvchi tizimga aloqasi yo'q narsa so'rasa, muloyimlik bilan faqat HR tizimi bo'yicha yordam bera olishingizni ayting.
- Emojilardan foydalaning (😊, ✅, 🚀) lekin oshirib yubormang.
`

export type ChatMessage = {
    role: 'system' | 'user' | 'assistant'
    content: string
}

export const sendMessageToAI = async (messages: ChatMessage[]) => {
    try {
        const apiKey = import.meta.env.VITE_OPENAI_API_KEY

        if (!apiKey) {
            console.error('OpenAI API Key is missing')
            return "Tizim xatoligi: API kalit topilmadi. (AI key missing)"
        }

        // Initialize OpenAI client lazily
        const openai = new OpenAI({
            apiKey: apiKey,
            dangerouslyAllowBrowser: true
        })

        const completion = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                ...messages
            ],
            model: 'gpt-4o-mini',
            temperature: 0.7,
            max_tokens: 300,
        })

        return completion.choices[0].message.content
    } catch (error) {
        console.error('Error contacting OpenAI:', error)
        return "Uzr, tizimda xatolik yuz berdi. Iltimos keyinroq urinib ko'ring."
    }
}
