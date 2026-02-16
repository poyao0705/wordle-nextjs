import { NextResponse } from "next/server";

const WORDLE_WORDS_URL = "https://api.frontendexpert.io/api/fe/wordle-words";

export async function GET() {
  const res = await fetch(WORDLE_WORDS_URL);
  const data = await res.json();
  return NextResponse.json(data);
}
