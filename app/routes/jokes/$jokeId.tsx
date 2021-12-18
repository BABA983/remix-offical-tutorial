import { Joke } from ".prisma/client";
import {
  ActionFunction,
  Link,
  LoaderFunction,
  MetaFunction,
  redirect,
  useCatch,
  useLoaderData,
  useMatches,
  useParams,
} from "remix";
import { db } from "~/utils/db.server";
import { getUserId, requireUserId } from "~/utils/session.server";

export const meta: MetaFunction = ({
  data,
}: {
  data: LoaderData | undefined;
}) => {
  if (!data) {
    return {
      title: "No joke",
      description: "No joke found",
    };
  }
  return {
    title: `"${data.joke.name}" joke`,
    description: `Enjoy the "${data.joke.name}" joke and much more`,
  };
};

type LoaderData = { joke: Joke; isOwner: boolean };

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await getUserId(request);
  // throw new Error("whoops");
  console.log(params); // <-- {jokeId: "123"}
  const joke = await db.joke.findUnique({ where: { id: params.jokeId } });
  // if (!joke) throw new Error("Joke not found");
  if (!joke) {
    throw new Response("What a joke! Not found.", {
      status: 404,
    });
  }
  const data: LoaderData = {
    joke,
    isOwner: userId === joke.jokesterId,
  };
  return data;
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();
  if (form.get("_method") === "delete") {
    const userId = await requireUserId(request);
    const joke = await db.joke.findUnique({
      where: { id: params.jokeId },
    });
    if (!joke) {
      throw new Response("Can't delete what does not exist", { status: 404 });
    }
    if (joke.jokesterId !== userId) {
      throw new Response("Pssh, nice try. That's not your joke", {
        status: 401,
      });
    }
    await db.joke.delete({ where: { id: params.jokeId } });
    return redirect("/jokes");
  }
};

export default function JokeRoute() {
  const data = useLoaderData<LoaderData>();
  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{data?.joke?.content}</p>
      <Link to=".">{data?.joke?.name} Permalink</Link>
      {data.isOwner ? (
        <form method="post">
          <input type="hidden" name="_method" value="delete" />
          <button type="submit" className="button">
            Delete
          </button>
        </form>
      ) : null}
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  const params = useParams();
  console.log(useMatches());
  // throw ahha;
  return (
    <div className="error-container">{`Something went wrong when loading ${params.jokeId}!!!`}</div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  const params = useParams();
  switch (caught.status) {
    case 404: {
      return (
        <div className="error-container">
          Huh? What the heck is {params.jokeId}?
        </div>
      );
    }
    case 401: {
      return (
        <div className="error-container">
          Sorry, but {params.jokeId} is not your joke.
        </div>
      );
    }
    default: {
      throw new Error(`Unhandled error: ${caught.status}`);
    }
  }
}
