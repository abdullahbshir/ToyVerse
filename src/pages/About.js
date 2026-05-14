import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const team = [
    { name: 'Sarah Johnson', role: 'Founder & CEO', img: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=fbbf24&color=fff&size=100' },
    { name: 'Mike Chen', role: 'Head of Product', img: 'https://ui-avatars.com/api/?name=Mike+Chen&background=fbbf24&color=fff&size=100' },
    { name: 'Priya Patel', role: 'Toy Curator', img: 'https://ui-avatars.com/api/?name=Priya+Patel&background=fbbf24&color=fff&size=100' },
    { name: 'David Kim', role: 'Customer Happiness', img: 'https://ui-avatars.com/api/?name=David+Kim&background=fbbf24&color=fff&size=100' },
  ];

  const faqs = [
    { q: 'What is your return policy?', a: 'We offer 30-day hassle-free returns on all unused toys.' },
    { q: 'Do you ship internationally?', a: 'Currently we ship within the US, with plans to expand soon.' },
    { q: 'Are the toys safe for toddlers?', a: 'All our toys meet ASTM safety standards and are rigorously tested.' },
  ];

  return (
    <div className="space-y-16 pb-10">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-3xl p-8 md:p-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About ToyVerse</h1>
        <p className="text-xl text-gray-700 max-w-2xl mx-auto">
          We're on a mission to bring joy, creativity, and learning to every child through carefully curated toys.
        </p>
      </section>

      {/* Our Story */}
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4">Our Story</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Founded in 2020, ToyVerse started in a small garage with a big dream: to make quality toys accessible to every family. 
            What began as a passion project has grown into a beloved brand trusted by thousands of parents.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Every toy in our collection is handpicked for its educational value, durability, and ability to spark imagination.
          </p>
          <div className="mt-6 flex gap-4">
            <div className="text-center">
              <span className="text-3xl font-bold text-yellow-600">5000+</span>
              <p className="text-sm">Happy Customers</p>
            </div>
            <div className="text-center">
              <span className="text-3xl font-bold text-yellow-600">200+</span>
              <p className="text-sm">Unique Toys</p>
            </div>
          </div>
        </div>
        <div className="bg-amber-100 rounded-3xl p-6 text-center text-8xl">
          🧸✨🚀
        </div>
      </section>

      {/* Mission & Values */}
      <section className="bg-white rounded-3xl p-8 shadow-sm">
        <h2 className="text-3xl font-bold text-center mb-8">Our Mission & Values</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: 'fa-heart', title: 'Child First', desc: 'Safety and development come before profit.' },
            { icon: 'fa-leaf', title: 'Sustainability', desc: 'Eco-friendly packaging and ethically sourced materials.' },
            { icon: 'fa-smile', title: 'Joyful Play', desc: 'Every toy is designed to create moments of pure happiness.' },
          ].map((v, i) => (
            <div key={i} className="text-center p-6 border rounded-2xl">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-2xl text-yellow-600 mb-4">
                <i className={`fas ${v.icon}`}></i>
              </div>
              <h3 className="text-xl font-bold mb-2">{v.title}</h3>
              <p className="text-gray-500">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8">Meet the Team</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {team.map((m, i) => (
            <div key={i} className="bg-white p-4 rounded-xl shadow-sm text-center">
              <img src={m.img} alt={m.name} className="w-24 h-24 rounded-full mx-auto mb-3 border-4 border-yellow-200" />
              <h3 className="font-bold">{m.name}</h3>
              <p className="text-sm text-gray-500">{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border rounded-xl overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100">
                <span className="font-medium">{faq.q}</span>
                <i className={`fas fa-chevron-${openFaq === i ? 'up' : 'down'}`}></i>
              </button>
              {openFaq === i && <div className="p-4 bg-white text-gray-600">{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-3xl p-8 text-center text-gray-900">
        <h2 className="text-3xl font-bold mb-2">Join the ToyVerse Family</h2>
        <p className="mb-6">Get updates on new arrivals and exclusive offers.</p>
        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input type="email" placeholder="Your email" className="flex-grow px-4 py-3 rounded-full" />
          <button className="bg-gray-900 text-white px-6 py-3 rounded-full font-bold">Subscribe</button>
        </form>
      </section>
    </div>
  );
};

export default About;