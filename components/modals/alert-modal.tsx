"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
}

export const AlertModal: React.FC<AlertModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    loading
}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
   
}, [])

if(!isMounted) {
    return null;
}

return (
    <Modal
    title="Êtes-vous sûr(e) ?"
    description="Cette action ne peut pas être annulée"    
    isOpen={isOpen}
    onClose={onClose}
    >
        <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button
        disabled={loading}
        variant="outline" 
        onClick={onClose}
        >
        Annuler
        </Button>
        <Button
        disabled={loading} 
        variant="destructive"
        onClick={onConfirm}
        >
            Continue
        </Button>
        </div>

    </Modal>
);

};