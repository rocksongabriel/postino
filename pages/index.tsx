import Head from "next/head";
import clientPromise from "../lib/mongodb";
import { InferGetServerSidePropsType } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--inter-font",
});

export async function getServerSideProps() {
  try {
    await clientPromise;
    const client = await clientPromise;
    const db = client.db("VolatilityRed");

    const vr_articles = await db
      .collection("volatility_red_blog_posts")
      .find({})
      .toArray();

    return {
      props: {
        isConnected: true,
        data: vr_articles.map((item) => {
          return {
            id: item._id.toString(),
            title: item.article_title,
            link: item.link_to_page,
          };
        }),
      },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { isConnected: false },
    };
  }
}

export default function Home({
  isConnected,
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="container">
      <Head>
        <title>FX Articles</title>
      </Head>

      <main>
        <h1 className="title">{isConnected && data?.length} Articles</h1>

        {isConnected &&
          data?.map((article) => (
            <a href={article.link} target="_blank" rel="noopener noreferrer">
              <p className="description">{article.title}</p>
            </a>
          ))}

        {!isConnected && <h1>Server Down, Sorry!</h1>}
      </main>

      <footer>
        <a href="#" rel="noopener noreferrer">
          Powered by Gabriel Rockson
        </a>
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 1rem 0 4rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 2;
          font-size: 3rem;
        }

        .title,
        .description {
          color: white;
          text-align: center;
        }

        .subtitle {
          font-size: 2rem;
        }

        .description {
          line-height: 1.1;
          font-size: 1.4rem;
        }

        .description:hover {
          color: #0070f3;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          background: black;
          color: #f0ead6;
          font-family: var(--inter-font);
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
