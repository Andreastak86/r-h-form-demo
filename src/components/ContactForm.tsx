"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

type FormValues = {
    name: string;
    email: string;
    melding: string;
};

export default function ContactForm() {
    const [submitted, setSubmitted] = useState(false);
    const [exploded, setExploded] = useState(false);
    const [hideMessage, setHideMessage] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormValues>();

    const onSubmit = async (data: FormValues) => {
        const { error } = await supabase.from("meldinger").insert([data]);

        if (error) {
            alert("Noe gikk galt: " + error.message);
        } else {
            setSubmitted(true);
            setExploded(false);
            setHideMessage(false);
            reset();

            // Gi animasjonen tid til å trigges etter at DOM er oppdatert
            setTimeout(() => setExploded(true), 100);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className='max-w-md mx-auto p-6 bg-white rounded-xl shadow space-y-4'
        >
            {submitted && !hideMessage && (
                <div
                    className={`bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded transition-all duration-500 ${
                        exploded ? "animate-explode" : ""
                    }`}
                    onAnimationEnd={() => setHideMessage(true)}
                >
                    Meldingen din er sendt! 🙌
                </div>
            )}

            <div>
                <label className='block font-semibold mb-1'>Navn</label>
                <input
                    {...register("name", { required: "Navn er påkrevd" })}
                    className='w-full border rounded px-3 py-2'
                />
                {errors.name && (
                    <p className='text-red-500 text-sm mt-1'>
                        {errors.name.message}
                    </p>
                )}
            </div>

            <div>
                <label className='block font-semibold mb-1'>E-post</label>
                <input
                    {...register("email", {
                        required: "E-post er påkrevd",
                        pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: "Ugyldig e-postadresse",
                        },
                    })}
                    className='w-full border rounded px-3 py-2'
                />
                {errors.email && (
                    <p className='text-red-500 text-sm mt-1'>
                        {errors.email.message}
                    </p>
                )}
            </div>

            <div>
                <label className='block font-semibold mb-1'>Melding</label>
                <textarea
                    {...register("melding", {
                        required: "Tekst er påkrevd",
                    })}
                    rows={5}
                    className='w-full border rounded px-3 py-2 resize-y'
                />
                {errors.melding && (
                    <p className='text-red-500 text-sm mt-1'>
                        {errors.melding.message}
                    </p>
                )}
            </div>

            <button
                type='submit'
                className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
            >
                Send skjema
            </button>
        </form>
    );
}
