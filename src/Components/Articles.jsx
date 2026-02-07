import React, { useState, useEffect } from "react";
import "./Articles.css";

import axios from "axios";
import { Link } from "react-router-dom";
import { GoArrowUpRight } from "react-icons/go";

const Articles = () => {
  const [articles, setArticles] = useState([]);

  const fetchArticles = async () => {
    const apiKey = import.meta.env.VITE_MEDIUM_API_KEY
    const rssFeedUrl = 'https://medium.com/feed/@oawoyomi';
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${rssFeedUrl}&api_key=${apiKey}`;
      await axios(apiUrl).then(feed =>
      setArticles(feed.data));
  };
  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <div className="articles mb-5">
      <div className="container mx-auto row justify-content-center">
        <h2 className="text-center my-2">Read latest articles</h2>
        <p className="text-center latest">
          Stay up to date on latest industry trends.
        </p>
        <div className="articles-container container my-4">
          {articles?.items
            ?.slice(
              articles.items.length > 3 ? articles.items.length - 3 : 0,
              articles.items.length
            )
            .map((article, i) => {
        const firstImg = (article['description']).toString().match(/<img[^>]+src="([^">]+)"/)[1]
              return <div className="card p-3 rounded-4" style={{border:'solid .5px #ddd'}} key={i}>
                <img
                  src={firstImg}
                  alt="article-thumbnail"
                  className="img-fluid article-img"
                
                />
                <div className="d-flex justify-content-between mt-3">
                  <p style={{ fontWeight: "500" }}>{article.title.slice(0, 90)}...</p>
                  <Link to={article.link} target="_blank">
                    <GoArrowUpRight style={{ fontSize: "20px" }} />
                  </Link>
                </div>
                <div>
                  <span className="fs-8">
                    {new Date(article.pubDate)?.toLocaleDateString()}
                  </span>
                </div>
              </div>
})}
        </div>
      </div>
    </div>
  );
};

export default Articles;
