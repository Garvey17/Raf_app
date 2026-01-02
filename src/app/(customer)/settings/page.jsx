'use client'
import { Card, CardContent } from "@/Components/ui/card";
import { User, Bell, Lock, Palette, Shield, Save } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useSession } from "next-auth/react";
import ThemeToggle from "../../../Components/ThemeButton";

export default function SettingsPage() {
    const { data: session } = useSession();
    const [isSaving, setIsSaving] = useState(false);

    const [settings, setSettings] = useState({
        // Profile
        name: session?.user?.name || "",
        email: session?.user?.email || "",
        phone: "",
        company: "",

        // Notifications
        
        emailNotifications: true,
        smsNotifications: false,
        orderUpdates: true,
        promotions: false,

        // Security
        twoFactorAuth: false,

        // Preferences
        language: "en",
        theme: "system",
        currency: "NGN"
    });

    const handleChange = (field, value) => {
        setSettings({
            ...settings,
            [field]: value
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSaving(false);
        alert("Settings saved successfully!");
    };

    const settingsSections = [
        {
            title: "Profile Information",
            icon: User,
            color: "blue",
            fields: [
                { name: "name", label: "Full Name", type: "text", placeholder: "John Doe" },
                { name: "email", label: "Email Address", type: "email", placeholder: "john@example.com" },
                { name: "phone", label: "Phone Number", type: "tel", placeholder: "+234 800 000 0000" },
                { name: "company", label: "Company Name", type: "text", placeholder: "Your Company" }
            ]
        },
        {
            title: "Notification Preferences",
            icon: Bell,
            color: "purple",
            toggles: [
                { name: "emailNotifications", label: "Email Notifications", description: "Receive notifications via email" },
                { name: "smsNotifications", label: "SMS Notifications", description: "Receive notifications via SMS" },
                { name: "orderUpdates", label: "Order Updates", description: "Get updates about your orders" },
                { name: "promotions", label: "Promotional Emails", description: "Receive promotional offers and news" }
            ]
        },
        {
            title: "Security",
            icon: Shield,
            color: "red",
            toggles: [
                { name: "twoFactorAuth", label: "Two-Factor Authentication", description: "Add an extra layer of security" }
            ]
        },
        {
            title: "Preferences",
            icon: Palette,
            color: "emerald",
            selects: [
                {
                    name: "theme",
                    label: "Theme",
                    options: [
                        { value: "light", label: "Light" },
                        { value: "dark", label: "Dark" },
                        { value: "system", label: "System" }
                    ]
                }
            ]
        }
    ];

    return (
        <div className="flex flex-col gap-4 sm:gap-6 p-3 sm:p-6 bg-gray-50/50 dark:bg-slate-950 min-h-screen">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-2">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
                    <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">Manage your account settings and preferences.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                    {isSaving ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            Save Changes
                        </>
                    )}
                </button>
            </div>

            {/* Settings Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {settingsSections.map((section, index) => (
                    <motion.div
                        key={section.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                                    <div className={`p-2 bg-${section.color}-50 dark:bg-${section.color}-900/20 rounded-lg`}>
                                        <section.icon className={`w-5 h-5 text-${section.color}-600`} />
                                    </div>
                                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{section.title}</h2>
                                </div>

                                <div className="space-y-4">
                                    {/* Text Fields */}
                                    {section.fields?.map((field) => (
                                        <div key={field.name}>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                {field.label}
                                            </label>
                                            <input
                                                type={field.type}
                                                value={settings[field.name]}
                                                onChange={(e) => handleChange(field.name, e.target.value)}
                                                placeholder={field.placeholder}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                                            />
                                        </div>
                                    ))}

                                    {/* Toggle Switches */}
                                    {section.toggles?.map((toggle) => (
                                        <div key={toggle.name} className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700">
                                            <div className="flex-1 pr-3">
                                                <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">{toggle.label}</p>
                                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{toggle.description}</p>
                                            </div>
                                            <button
                                                onClick={() => handleChange(toggle.name, !settings[toggle.name])}
                                                className={`relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${settings[toggle.name] ? 'bg-blue-600' : 'bg-gray-300 dark:bg-slate-600'
                                                    }`}
                                            >
                                                <div
                                                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${settings[toggle.name] ? 'translate-x-6' : 'translate-x-0'
                                                        }`}
                                                />
                                            </button>
                                        </div>
                                    ))}

                                    {/* Select Dropdowns */}
                                    {section.selects?.map((select) => (
                                        <div key={select.name}>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                {select.label}
                                            </label>
                                            {select.name === 'theme' ? (
                                                <div className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white flex items-center">
                                                    <ThemeToggle />
                                                </div>
                                            ) : (
                                                <select
                                                    value={settings[select.name]}
                                                    onChange={(e) => handleChange(select.name, e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                                                >
                                                    {select.options.map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Danger Zone */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Card className="rounded-3xl shadow-sm border-2 border-red-200 dark:border-red-900/50 bg-white dark:bg-slate-900">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                <Lock className="w-5 h-5 text-red-600" />
                            </div>
                            <h2 className="text-lg sm:text-xl font-bold text-red-600 dark:text-red-400">Danger Zone</h2>
                        </div>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
                            Irreversible actions that will permanently affect your account.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button className="px-4 py-2 border-2 border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-xl font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-sm sm:text-base">
                                Delete Account
                            </button>
                            <button className="px-4 py-2 border-2 border-orange-200 dark:border-orange-900 text-orange-600 dark:text-orange-400 rounded-xl font-medium hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all text-sm sm:text-base">
                                Reset All Data
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
