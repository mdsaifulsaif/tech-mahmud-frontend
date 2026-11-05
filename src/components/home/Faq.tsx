"use client";
import React, { useState } from "react";
// import ShareButton from "../shared/button/ShareButton";

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

const Faq = () => {
  const [openId, setOpenId] = useState<number | null>(1);
  const toggleFaq = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  const faqData: FaqItem[] = [
    {
      id: 1,
      question: "What are your delivery hours?",
      answer:
        "We offer same-day delivery for orders placed before 11 AM. Our delivery window is between 6-8 PM. For express delivery, we can deliver within 2 hours at an additional charge of ৳50.",
    },
    {
      id: 2,
      question: "What is your return policy?",
      answer:
        "If you are not satisfied with the quality of our products, you can return them at the time of delivery or within 24 hours with the original packaging.",
    },
    {
      id: 3,
      question: "Do you have a minimum order amount?",
      answer:
        "No, we do not have a minimum order requirement, but orders below ৳500 will have a standard delivery fee applied.",
    },
    {
      id: 4,
      question: "How do I know the products are fresh?",
      answer:
        "We source our products directly from local farmers and trusted suppliers daily to ensure maximum freshness and top quality.",
    },
    {
      id: 5,
      question: "What payment methods do you accept?",
      answer:
        "We accept Cash on Delivery (COD), Bkash, Nagad, and all major local debit/credit cards through our secure payment gateway.",
    },
    {
      id: 6,
      question: "Can I track my order?",
      answer:
        "Yes! Once your order is confirmed, you can track its real-time status from the 'Order Tracking' section in your account.",
    },
    {
      id: 7,
      question: "What areas do you deliver to?",
      answer:
        "Currently, we operate and deliver across all major areas in Dhaka city. We are expanding to other regions very soon.",
    },
  ];

  return (
    <section className="py-6 sm:py-8 bg-[#fbfcfa]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* Title & Subtitle Area */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-gray-500">
            Got questions? We've got answers. Find everything you need to know below.
          </p>
        </div>

      {/* Accordion Wrapper */}
      <div className="w-full flex flex-col gap-3">
        {faqData.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className={`w-full bg-white border border-[#EBF0E8] rounded-[16px] p-6 transition-all duration-300 ${
                isOpen ? "min-h-[134px]" : "min-h-[82px] cursor-pointer"
              }`}
              onClick={() => !isOpen && toggleFaq(item.id)} 
            >
       
              <div
                className="flex justify-between items-center gap-4 cursor-pointer select-none"
                onClick={(e) => {
                  if (isOpen) {
                    e.stopPropagation();
                    toggleFaq(item.id);
                  }
                }}
              >
                <h4 className="subtext-large-medium text-[#0E2038] ">
                  {item.question}
                </h4>

                <div className="flex-shrink-0">
                  {isOpen ? (
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16Z"
                        fill="#EBF0E8"
                      />
                      <path
                        d="M21 18.5L16 13.5L11 18.5"
                        stroke="#37651B"
                        strokeWidth="1.66667"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
            
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32C24.8366 32 32 24.8366 32 16Z"
                        fill="#EBF0E8"
                      />
                      <path
                        d="M21 13.5L16 18.5L11 13.5"
                        stroke="#37651B"
                        strokeWidth="1.66667"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </div>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen
                    ? "grid-rows-[1fr] opacity-100 mt-3"
                    : "grid-rows-[0fr] opacity-0 overflow-hidden"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="subtext-large-medium text-[#7F8482]">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-7 flex flex-col items-center gap-2">
        <span className="subtext-large-medium mb-1 text-[#7F8482]">
          Still have questions?
        </span>
        {/* <ShareButton title="Contact Support"></ShareButton> */}
      </div>
    </div>
    </section>
  );
};

export default Faq;