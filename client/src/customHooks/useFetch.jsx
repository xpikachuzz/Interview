import { useEffect, useState } from "react";

const useFetch = (fetchCallback, dependencyArray) => {
    const [result, setResult] = useState();
    const [loading, setLoading] = useState("Reciving question...");
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await fetchCallback();
                setResult(res);
                setError(null);
                setLoading(false);
            } catch (e) {
                setError(e);
                setLoading(false);
            }
        };

        fetch();
    }, dependencyArray);

    return { result, loading, error, setLoading, setError };
};

export default useFetch;
