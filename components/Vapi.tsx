"use client";

import { vapi } from "@/lib/vpi.sdk";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Phone, PhoneOff } from "lucide-react";
import { Message } from "@/types";

type SavedMessage = {
  role: "user" | "system" | "assistant";
  content: string;
};

enum CallStatus {
  ACTIVE = "active",
  CONNECTING = "CONNECTING",
  INACTIVE = "inactive",
  FINISHED = "finished",
}

const Vapi = () => {
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [latestMessage, setLatestMessage] = useState("");

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onSpeechStart = () => {
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      setIsSpeaking(true);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onError = (error: Error) => {
      console.log("Error:", error);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", (message) => onMessage(message));
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", (message) => onMessage(message));
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLatestMessage(messages[messages.length - 1].content);
    }
  }, [messages, isSpeaking]);

  console.log(latestMessage);

  const handleCall = () => {
    setCallStatus(CallStatus.ACTIVE);

    vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID);
  };

  const handleCallEnd = () => {
    setCallStatus(CallStatus.FINISHED);

    vapi.stop();
  };

  return (
    <div className="w-full max-w-[1140px] px-3">
      <div className="flex gap-4">
        <div className="aiWrapper">
          <div className="relative w-[130px] h-[130px] flex items-center justify-center">
            <span
              className={`absolute inline-flex h-3/4 w-3/4 rounded-full bg-primary-100 opacity-75 ${
                callStatus === "active" ? "animate-ping" : ""
              }`}
            />
            <div className="relative h-full w-full flex items-center justify-center bg-primary-100 rounded-full">
              <Image src="/ai-avatar.png" width={54} height={54} alt="vapi" />
            </div>
          </div>

          <span className="text-white">AI Interviewer</span>
        </div>

        <div className="hidden lg:block cardWrapperBorder w-full">
          <div className="cardWrapper w-full h-[450px] flex flex-col justify-center items-center gap-[10px] !p-0 ">
            <div className="w-[130px] h-[130px] flex items-center justify-center">
              <Image
                src="/user-avatar.png"
                width={130}
                height={130}
                alt="vapi"
                className="rounded-full object-cover"
              />
            </div>

            <span className="text-white">AI Interviewer</span>
          </div>
        </div>
      </div>

      {messages.length ? (
        <div className="cardWrapperBorder w-full h-[70px] mt-4">
          <div className="cardWrapper !p-0 h-full flex justify-center items-center text-white text-2xl">
            {latestMessage}
          </div>
        </div>
      ) : (
        ""
      )}

      {callStatus === "active" ? (
        <button
          onClick={handleCallEnd}
          className="flex items-center gap-2 py-4 px-8 bg-red-500 rounded-full text-white text-lg mx-auto mt-12 cursor-pointer"
        >
          <PhoneOff className="w-5 h-5" /> End Call
        </button>
      ) : (
        <button
          onClick={handleCall}
          className="flex items-center gap-2 py-4 px-8 bg-green-500 rounded-full text-white text-lg mx-auto mt-12 cursor-pointer"
        >
          <Phone className="w-5 h-5" /> Call
        </button>
      )}
    </div>
  );
};

export default Vapi;
