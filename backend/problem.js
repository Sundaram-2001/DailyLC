const query = `
  query getDailyProblem {
    activeDailyCodingChallengeQuestion {
      date
      link
      question {
        title
        difficulty
      }
    }
  }
`;

const fetchDailyProblem = async () => {
  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (YourAppName)"
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();

    const daily = data.data.activeDailyCodingChallengeQuestion;
    const title = daily.question.title;
    const difficulty = daily.question.difficulty;
    const url = `https://leetcode.com${daily.link}`;

    console.log(url)
    return { title, url, difficulty };

  } catch (error) {
    console.error("Error fetching LeetCode POTD:", error);
    return null;
  }
};

export default fetchDailyProblem
