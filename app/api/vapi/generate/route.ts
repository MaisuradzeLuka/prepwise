import { db } from "@/firebase/admin";
import { GoogleGenAI } from "@google/genai";

export async function GET() {
  return Response.json({ message: "hellow world" }, { status: 200 });
}

export async function POST(request: Request) {
  const { role, level, techstack, type, amount, userid } = await request.json();

  const ai = new GoogleGenAI({});

  console.log(
    "role",
    role,
    "level",
    level,
    "techstack",
    techstack,
    "type",
    type,
    "amount",
    amount
  );

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]

        Thank you! <3
    `,
    });

    console.log("response", response);

    const questions = response.text?.split(",");

    const interview = {
      role: role,
      type: type,
      level: level,
      techstack: techstack.split(","),
      questions: questions,
      userId: userid,
      finalized: true,
      // coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    console.log("interview", interview);

    await db.collection("interviews").add(interview);

    return Response.json(
      { success: true, message: "success" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(error);

    return Response.json(
      { success: false, message: "Error while posting ai prompt" },
      { status: 500 }
    );
  }
}
