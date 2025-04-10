import { useEffect, useState } from "react";

const useFetch = (fetchCallback) => {
    const [result, setResult] = useState();
    const [loading, setLoading] = useState(true);
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
    }, []);

    return { result, loading, error };
};

export default useFetch;
