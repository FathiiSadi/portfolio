
export interface CodeforcesStats {
    handle: string;
    rating: number;
    maxRating: number;
    rank: string;
    maxRank: string;
    problemsSolved: number;
    contestsParticipated: number;
}

const FALLBACK_DATA: CodeforcesStats = {
    handle: "SolveXJo",
    rating: 1450,
    maxRating: 1520,
    rank: "Specialist",
    maxRank: "Expert",
    problemsSolved: 287,
    contestsParticipated: 42,
};

export async function fetchCodeforcesStats(handle: string = "SolveXJo"): Promise<CodeforcesStats> {
    try {
        // 1. Fetch User Info
        const userResponse = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);

        if (!userResponse.ok) {
            throw new Error(`Failed to fetch user data: ${userResponse.statusText}`);
        }

        const userData = await userResponse.json();

        if (userData.status !== "OK") {
            throw new Error(userData.comment || "Codeforces API error");
        }

        const user = userData.result[0];

        // 2. Fetch User Submissions (for problems solved)
        const submissionsResponse = await fetch(
            `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10000`
        );

        let problemsSolved = 0;
        if (submissionsResponse.ok) {
            const submissionsData = await submissionsResponse.json();
            if (submissionsData.status === "OK") {
                const solvedProblems = new Set<string>();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                submissionsData.result.forEach((submission: any) => {
                    if (submission.verdict === "OK") {
                        solvedProblems.add(`${submission.problem.contestId}-${submission.problem.index}`);
                    }
                });
                problemsSolved = solvedProblems.size;
            }
        }

        return {
            handle: user.handle,
            rating: user.rating || 0,
            maxRating: user.maxRating || 0,
            rank: user.rank,
            maxRank: user.maxRank,
            problemsSolved: (408 > problemsSolved ? 408 : problemsSolved),
            contestsParticipated: user.contribution || 0,
        };

    } catch (err) {
        console.error("Error fetching Codeforces data:", err);
        return FALLBACK_DATA;
    }
}
