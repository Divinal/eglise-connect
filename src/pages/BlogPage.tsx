import Layout from "@/components/Layout";

const BlogPage = () => {
  return (
    <Layout>
      <div className="bg-primary py-12">
        <div className="container">
          <h1 className="font-display text-3xl md:text-4xl text-primary-foreground">Blog</h1>
        </div>
      </div>
      <section className="py-12 bg-cream">
        <div className="container text-center">
          <p className="text-muted-foreground text-lg">Les articles de blog seront publiés ici.</p>
        </div>
      </section>
    </Layout>
  );
};

export default BlogPage;
