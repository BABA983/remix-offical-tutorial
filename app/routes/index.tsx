import type { LinksFunction, MetaFunction } from "remix";
import { Link } from "remix";
import { Button } from "antd";
// import antdCss from "antd/dist/antd.css";
import stylesUrl from "../styles/index.css";

export const links: LinksFunction = () => {
  return [
    // {
    //   rel: "stylesheet",
    //   href: antdCss,
    // },
    {
      rel: "stylesheet",
      href: stylesUrl,
    },
  ];
};

export const meta: MetaFunction = () => {
  return {
    title: "Remix: So great, it's funny!",
    description: "Remix jokes app. Learn Remix and laugh at the same time!",
  };
};

export default function Index() {
  return (
    <div className="container">
      <div className="content">
        <h1>
          Remix <span>Jokes!</span>
        </h1>
        <Button>antd</Button>
        <nav>
          <ul>
            <li>
              <Link to="jokes">Read Jokes</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
