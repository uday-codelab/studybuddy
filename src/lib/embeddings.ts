const HF_MODEL = "BAAI/bge-small-en-v1.5";
const HF_URL = `https://router.huggingface.co/hf-inference/models/${HF_MODEL}/pipeline/feature-extraction`;

async function embed(inputs: string | string[]): Promise<number[] | number[][]> {
  const res = await fetch(HF_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY!}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Hugging Face embedding failed: ${err}`);
  }

  return res.json();
}

export async function embedText(text: string): Promise<number[]> {
  const result = await embed(text) as number[][];
  return Array.isArray(result[0]) ? result[0] : result as unknown as number[];
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  const result = await embed(texts);
  return result as number[][];
}