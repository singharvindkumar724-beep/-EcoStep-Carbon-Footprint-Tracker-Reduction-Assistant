"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { ActionItem } from "@/data/actions";

interface ActionModalProps {
  action: ActionItem | null;
  onClose: () => void;
}

export default function ActionModal({ action, onClose }: ActionModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close details modal on Escape key press and manage focus trap for accessibility compliance
  useEffect(() => {
    if (!action) return;
    
    // Focus the close button when the modal opens
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      
      // Simple focus trap: prevent tabbing outside the modal
      if (e.key === "Tab") {
        const focusableElements = document.querySelectorAll(
          '#action-modal-container button, #action-modal-container [href], #action-modal-container input, #action-modal-container select, #action-modal-container textarea, #action-modal-container [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [action, onClose]);

  if (!action) return null;

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "food": return "bg-orange-50 border-orange-200 text-orange-800";
      case "travel": return "bg-blue-50 border-blue-200 text-blue-800";
      case "energy": return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "shopping": return "bg-purple-50 border-purple-200 text-purple-800";
      default: return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="action-modal-title">
      <div id="action-modal-container" className="w-full max-w-md bg-white rounded-modal shadow-modal border border-gray-100 p-6 space-y-6 relative max-h-[85vh] overflow-y-auto">
        
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-full outline-none focus:ring-2 focus:ring-primary-green focus:ring-offset-2"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-4">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getCategoryColor(action.category)}`}>
            {action.category}
          </span>
          <h2 id="action-modal-title" className="text-lg font-bold text-gray-900 pr-6 leading-tight">
            {action.title}
          </h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            {action.description}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 py-2.5 border-t border-b border-gray-100 text-center text-[10px] text-gray-500">
          <div>
            <span className="block mb-0.5 font-semibold text-gray-400">Carbon Savings</span>
            <strong className="text-primary-green font-bold text-xs">-{action.co2Savings} kg/yr</strong>
          </div>
          <div>
            <span className="block mb-0.5 font-semibold text-gray-400">Difficulty</span>
            <strong className="text-gray-800 font-bold uppercase">{action.difficulty}</strong>
          </div>
          <div>
            <span className="block mb-0.5 font-semibold text-gray-400">Cost Impact</span>
            <strong className="text-gray-800 font-bold capitalize">{action.costImpact}</strong>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Implementation Guide</h4>
          <ol className="space-y-2">
            {action.implementationSteps.map((step, idx) => (
              <li key={idx} className="flex gap-2.5 text-xs text-gray-600">
                <span className="w-4.5 h-4.5 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-semibold shrink-0">
                  {idx + 1}
                </span>
                <span className="mt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <button
          onClick={onClose}
          className="w-full h-11 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-btn text-xs cursor-pointer outline-none focus:ring-2 focus:ring-primary-green focus:ring-offset-2"
        >
          Done Reading
        </button>

      </div>
    </div>
  );
}
