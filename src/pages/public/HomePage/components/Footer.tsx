import React from 'react'
import { Users, Clock, TrendingUp, Layers, ArrowRight, Linkedin, Mail, Github } from 'lucide-react';



function Footer() {
    return (
        <div>
            {/* Footer */}
            <footer className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-3">
                                    <img
                                        src='/images/ESIS.png'
                                        alt="Logo"
                                        className="h-32 w-auto"
                                    />
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut elit Lorem ipsum dolor.
                            </p>
                            <div className="flex space-x-3">
                                <button className="w-8 h-8 bg-gray-800 text-white rounded flex items-center justify-center hover:bg-gray-700 transition-colors">
                                    <Linkedin className="w-4 h-4" />
                                </button>
                                <button className="w-8 h-8 bg-gray-800 text-white rounded flex items-center justify-center hover:bg-gray-700 transition-colors">
                                    <Mail className="w-4 h-4" />
                                </button>
                                <button className="w-8 h-8 bg-gray-800 text-white rounded flex items-center justify-center hover:bg-gray-700 transition-colors">
                                    <Github className="w-4 h-4" />
                                </button>
                                <button className="w-8 h-8 bg-gray-800 text-white rounded flex items-center justify-center hover:bg-gray-700 transition-colors">
                                    <span className="text-xs font-bold">𝕏</span>
                                </button>
                            </div>
                        </div>

                        {/* Programs */}
                        <div>
                            <h3 className="font-bold text-gray-800 mb-4">Programs</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li><a href="#" className="hover:text-gray-900">Internships</a></li>
                                <li><a href="#" className="hover:text-gray-900">Webinar</a></li>
                                <li><a href="#" className="hover:text-gray-900">Startup Registration</a></li>
                                <li><a href="#" className="hover:text-gray-900">Membership</a></li>
                            </ul>
                        </div>

                        {/* Community */}
                        <div>
                            <h3 className="font-bold text-gray-800 mb-4">Community</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li><a href="#" className="hover:text-gray-900">Projects</a></li>
                                <li><a href="#" className="hover:text-gray-900">Tech-updates</a></li>
                                <li><a href="#" className="hover:text-gray-900">Events</a></li>
                                <li><a href="#" className="hover:text-gray-900">Forum</a></li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h3 className="font-bold text-gray-800 mb-4">Support</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li><a href="#" className="hover:text-gray-900">Help center</a></li>
                                <li><a href="#" className="hover:text-gray-900">Contact us</a></li>
                                <li><a href="#" className="hover:text-gray-900">Privacy and policy</a></li>
                                <li><a href="#" className="hover:text-gray-900">Terms and condition</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 mt-8 pt-8 text-center">
                        <p className="text-sm text-gray-500">
                            2025 Tech-portal. All right reserved. Built by ESIS tech community.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Footer
