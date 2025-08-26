import { BlogHero } from "./_component/BlogHero";
import BlogList from "./_component/BlogList";

export default function Blog() {
  return (
    <div className="flex flex-col overflow-hidden bg-background-gray">
      <BlogHero />
      <BlogList />
    </div>
  );
}
