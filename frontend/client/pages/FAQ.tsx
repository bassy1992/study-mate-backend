import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageCircle, Phone, Mail } from "lucide-react";

export default function FAQ() {
  const faqSections = [
    {
      title: "General Information",
      questions: [
        {
          question: "What is GhanaLearn?",
          answer:
            "GhanaLearn is an online learning platform designed specifically for Junior High School (JHS) students in Ghana. We provide comprehensive learning bundles for English, Mathematics, and Integrated Science that align with the Ghana Education Service (GES) curriculum.",
        },
        {
          question: "How does GhanaLearn align with the GES curriculum?",
          answer:
            "All our content is carefully developed and reviewed by certified Ghanaian teachers to ensure 100% alignment with the official GES curriculum for JHS 1, 2, and 3. Our lessons, quizzes, and assessments follow the same structure and learning objectives as your school curriculum.",
        },
        {
          question: "What subjects are covered?",
          answer:
            "Each bundle includes three core subjects: English Language, Mathematics, and Integrated Science. These subjects are essential for JHS students and form the foundation for BECE preparation and senior high school readiness.",
        },
        {
          question: "What JHS levels do you cover?",
          answer:
            "We offer complete course bundles for JHS 1, JHS 2, and JHS 3. Each level is specifically tailored to the curriculum requirements and learning objectives for that particular year.",
        },
      ],
    },
    {
      title: "Pricing & Payment",
      questions: [
        {
          question: "How much does each bundle cost?",
          answer:
            "Each JHS bundle (JHS 1, 2, or 3) costs just $15 USD. This gives you complete access to English, Math, and Science for that level, including video lessons, quizzes, practice exercises, and study materials.",
        },
        {
          question: "What payment methods do you accept?",
          answer:
            "We support Mobile Money payments (MTN Mobile Money, Vodafone Cash, and AirtelTigo Money) as well as international debit and credit cards (Visa and Mastercard). All payments are processed securely through trusted payment gateways.",
        },
        {
          question: "How do I pay with Mobile Money?",
          answer:
            "During checkout, select Mobile Money as your payment method, choose your network (MTN, Vodafone, or AirtelTigo), enter your mobile number, and follow the prompts to complete the payment. You'll receive an SMS confirmation and instant access to your bundle.",
        },
        {
          question: "Is my payment information secure?",
          answer:
            "Yes, absolutely. All payment processing is handled by certified payment gateways with bank-level security. We never store your payment information on our servers, and all transactions are encrypted and secure.",
        },
        {
          question: "Can I buy multiple bundles?",
          answer:
            "Yes! You can purchase bundles for different JHS levels. Many students buy the bundle for their current level plus the next level to get ahead in their studies.",
        },
      ],
    },
    {
      title: "Refunds & Support",
      questions: [
        {
          question: "What is your refund policy?",
          answer:
            "We offer a 7-day money-back guarantee. If you're not satisfied with your purchase within the first 7 days, contact our support team for a full refund. After 7 days, refunds are considered on a case-by-case basis for technical issues.",
        },
        {
          question: "How do I request a refund?",
          answer:
            "To request a refund, email us at support@ghanalearn.com with your order details and reason for the refund request. Our team will process legitimate refund requests within 3-5 business days.",
        },
        {
          question: "What if I have technical problems?",
          answer:
            "If you experience any technical issues, please contact our support team immediately. We provide free technical support to all students and will work to resolve any problems quickly.",
        },
        {
          question: "How can I contact customer support?",
          answer:
            "You can reach our customer support team via email at support@ghanalearn.com, or through our contact form. We typically respond within 24 hours during business days.",
        },
      ],
    },
    {
      title: "Technical Requirements",
      questions: [
        {
          question: "What devices can I use to access GhanaLearn?",
          answer:
            "GhanaLearn works on smartphones, tablets, laptops, and desktop computers. Our platform is optimized for mobile devices, so you can learn effectively even on a basic smartphone with internet access.",
        },
        {
          question: "Do I need a fast internet connection?",
          answer:
            "No, GhanaLearn is designed to work well on slower internet connections common in Ghana. Our videos are optimized for low bandwidth, and you can download content for offline viewing when you have a good connection.",
        },
        {
          question: "Can I download content for offline viewing?",
          answer:
            "Yes! You can download video lessons, study materials, and practice exercises to study offline. This is perfect for students in areas with limited internet connectivity.",
        },
        {
          question: "What web browser should I use?",
          answer:
            "GhanaLearn works on all modern web browsers including Chrome, Firefox, Safari, and Edge. For the best experience on mobile, we recommend using Chrome or Safari.",
        },
        {
          question: "Do you have a mobile app?",
          answer:
            "Currently, GhanaLearn is available as a responsive web application that works great on mobile devices. A dedicated mobile app is in development and will be available soon.",
        },
      ],
    },
    {
      title: "Learning & Progress",
      questions: [
        {
          question: "How long do I have access to my bundle?",
          answer:
            "Once you purchase a bundle, you have access for 3 months. This gives you plenty of time to complete all lessons and practice exercises at your own pace.",
        },
        {
          question: "Can I retake quizzes?",
          answer:
            "Yes! You can retake quizzes as many times as you want to improve your understanding and scores. The system will track your best score for each quiz.",
        },
        {
          question: "How do I track my progress?",
          answer:
            "Your student dashboard shows detailed progress tracking including completion percentages for each subject, quiz scores, time spent studying, and areas that need more attention.",
        },
        {
          question: "Will I receive a certificate?",
          answer:
            "Yes! Upon completing a bundle (achieving 80% or higher in all subjects), you'll receive a digital certificate of completion that you can download and share.",
        },
        {
          question: "Can I study at my own pace?",
          answer:
            "Absolutely! GhanaLearn is designed for self-paced learning. You can study whenever and wherever is convenient for you, 24/7 throughout your access period.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-50 via-blue-50/50 to-white px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center px-4 py-2 bg-brand-primary/10 text-brand-primary text-sm font-medium rounded-full mb-4">
            💡 Get Your Questions Answered
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Find answers to common questions about GhanaLearn, our courses,
            pricing, and how to get started.
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          {faqSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-brand-primary pb-2">
                {section.title}
              </h2>
              <Accordion type="single" collapsible className="space-y-2">
                {section.questions.map((faq, faqIndex) => (
                  <AccordionItem
                    key={faqIndex}
                    value={`${sectionIndex}-${faqIndex}`}
                    className="border border-gray-200 hover:border-brand-primary/30 rounded-lg px-4 transition-colors duration-200"
                  >
                    <AccordionTrigger className="text-left font-medium text-gray-900 hover:text-brand-primary transition-colors duration-200">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </section>

      {/* Still Have Questions Section */}
      <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Still Have Questions?
            </h2>
            <p className="text-lg text-gray-600">
              Our friendly support team is here to help you succeed in your
              studies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100 hover:border-brand-primary/20">
              <div className="space-y-4">
                <div className="bg-brand-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto">
                  <Mail className="h-6 w-6 text-brand-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Email Support
                </h3>
                <p className="text-gray-600">
                  Get detailed help via email. We respond within 24 hours.
                </p>
                <p className="text-sm font-medium text-brand-primary">
                  support@ghanalearn.com
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100 hover:border-blue-400/20">
              <div className="space-y-4">
                <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mx-auto">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Phone Support
                </h3>
                <p className="text-gray-600">
                  Call us for urgent issues and technical support.
                </p>
                <p className="text-sm font-medium text-blue-600">
                  +233 XX XXX XXXX
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100 hover:border-brand-secondary/20">
              <div className="space-y-4">
                <div className="bg-brand-secondary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto">
                  <MessageCircle className="h-6 w-6 text-brand-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Live Chat
                </h3>
                <p className="text-gray-600">
                  Quick answers to your questions during business hours.
                </p>
                <p className="text-sm font-medium text-brand-secondary">Coming Soon</p>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <Button
              size="lg"
              className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary/90 hover:to-brand-secondary/90 text-white text-lg px-8 py-3 h-auto shadow-lg hover:shadow-xl transition-all duration-300"
              asChild
            >
              <Link to="/bundles">Start Learning Today</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
