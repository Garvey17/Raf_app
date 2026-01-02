'use client'
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MessageCircle, HelpCircle, FileText, Send } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function SupportPage() {
    const [formData, setFormData] = useState({
        subject: "",
        message: "",
        priority: "medium"
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setFormData({ subject: "", message: "", priority: "medium" });
        alert("Support ticket submitted successfully!");
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const contactMethods = [
        {
            icon: Mail,
            title: "Email Support",
            value: "support@mcommerce.com",
            description: "We'll respond within 24 hours",
            color: "blue"
        },
        {
            icon: Phone,
            title: "Phone Support",
            value: "+234 800 123 4567",
            description: "Mon-Fri, 9AM-5PM WAT",
            color: "emerald"
        },
        {
            icon: MessageCircle,
            title: "Live Chat",
            value: "Start Chat",
            description: "Average response: 5 mins",
            color: "purple"
        }
    ];

    const faqs = [
        {
            question: "How do I track my order?",
            answer: "You can track your order from the Orders page. Click on any order to see its current status and delivery information."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept bank transfers, card payments, and cash on delivery for orders within Lagos."
        },
        {
            question: "How long does delivery take?",
            answer: "Standard delivery takes 2-5 business days depending on your location. Express delivery is available for select areas."
        },
        {
            question: "Can I cancel or modify my order?",
            answer: "Orders can be cancelled or modified within 2 hours of placement. Contact support for assistance."
        }
    ];

    return (
        <div className="flex flex-col gap-4 sm:gap-6 p-3 sm:p-6 bg-gray-50/50 dark:bg-slate-950 min-h-screen">

            {/* Header */}
            <div className="mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Support Center</h1>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">We're here to help you with any questions or issues.</p>
            </div>

            {/* Contact Methods */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {contactMethods.map((method, index) => (
                    <motion.div
                        key={method.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="h-full rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                            <CardContent className="p-4 sm:p-6">
                                <div className={`p-3 bg-${method.color}-50 dark:bg-${method.color}-900/20 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform`}>
                                    <method.icon className={`w-6 h-6 text-${method.color}-600`} />
                                </div>
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1">{method.title}</h3>
                                <p className="text-lg sm:text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">{method.value}</p>
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{method.description}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Submit Ticket Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-2"
                >
                    <Card className="rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center gap-3 mb-4 sm:mb-6">
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Submit a Ticket</h2>
                                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Describe your issue and we'll get back to you</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                                        placeholder="Brief description of your issue"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Priority
                                    </label>
                                    <select
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm sm:text-base"
                                        placeholder="Provide details about your issue..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Submit Ticket
                                        </>
                                    )}
                                </button>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* FAQs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card className="rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center gap-3 mb-4 sm:mb-6">
                                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                    <HelpCircle className="w-5 h-5 text-emerald-600" />
                                </div>
                                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">FAQs</h2>
                            </div>

                            <div className="space-y-3 sm:space-y-4">
                                {faqs.map((faq, index) => (
                                    <details
                                        key={index}
                                        className="group rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden"
                                    >
                                        <summary className="px-3 sm:px-4 py-2 sm:py-3 cursor-pointer font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors list-none flex items-center justify-between">
                                            <span className="text-xs sm:text-sm">{faq.question}</span>
                                            <HelpCircle className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-2" />
                                        </summary>
                                        <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 dark:bg-slate-800/50 text-xs sm:text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-slate-700">
                                            {faq.answer}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
