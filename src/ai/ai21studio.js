export async function chatWithAI21({message}) {
	const response = await fetch("https://api.ai21.com/studio/v1/chat/completions", {
		method: "POST", 
		headers: {
			"Authorization": `Bearer ${process.env.AI21_API_KEY}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			"model": "jamba-1.5-large",
			"messages": [
			{
				"role": "user", 
				"content": message,
			}],
			"documents":[],
			"tools":[],
			"n": 1,
			"max_tokens": 2048,
			"temperature": 0.4,
			"top_p": 1,
			"stop": [],
			"response_format":{"type": "text"},
		}),
	});

	const data = await response.json();
	return data.choices[0].message.content;
}