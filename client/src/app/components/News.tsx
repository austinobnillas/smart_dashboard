"use client"
import { useEffect, useState } from "react";

type NewsProps = {
news: {
    title: string;
    abstract: string;
    url: string;
    byline?: string;
    multimedia?: { url: string }[];
}[];
};

const News = ({ news }: NewsProps) => {
const [show, setShow] = useState(false);

useEffect(() => {
    setShow(true); // Trigger fade-in animation when component mounts
}, []);

return (
    <section
    className={`m-5 lg:h-1/2 flex flex-col p-5 bg-neutral-100 text-center border-3 border-gray-500 rounded-lg transition-opacity delay-900 duration-2000 ${
        show ? "opacity-100" : "opacity-0"
    }`}
    >
    <h1 className="shrink-0 text-xl font-bold mb-2 text-left">Top News</h1>

    {/* Scrollable container with max height */}
    <div className="flex-1 overflow-y-auto max-h-[45vh] space-y-4 pr-2">
        {news.map((article, index) => (
        <div
            key={index}
            className="news-item bg-neutral-200 p-4 rounded flex items-center space-x-4"
        >
            <div className="news-text text-left flex-1">
            <h2 className="font-semibold">{article.title}</h2>
            <p>{article.abstract}</p>
            {article.byline && <p>{article.byline}</p>}
            <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
            >
                Read more →
            </a>
            </div>
            {article.multimedia?.[0]?.url && (
            <img
                src={article.multimedia[0].url}
                alt={article.title}
                className="w-32 h-32 object-cover rounded"
            />
            )}
        </div>
        ))}
    </div>
    </section>
);
};

export default News;