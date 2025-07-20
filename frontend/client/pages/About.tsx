import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  BookOpen,
  Users,
  Award,
  Target,
  CheckCircle,
  Heart,
} from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-white px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            About GhanaLearn
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Empowering the next generation of Ghanaian students with quality
            education that aligns perfectly with the Ghana Education Service
            curriculum.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Our Mission
                </h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                To make quality JHS education accessible to every student in
                Ghana through innovative digital learning solutions. We believe
                that every Ghanaian student deserves the opportunity to excel in
                their studies, regardless of their location or economic
                background.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our platform bridges the educational gap by providing
                comprehensive learning resources that follow the GES curriculum,
                ensuring students are well-prepared for their BECE examinations
                and future academic pursuits.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 text-white">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">Why We Started</h3>
                <p className="text-lg opacity-90">
                  Founded by Ghanaian educators who understand the challenges
                  facing our education system, GhanaLearn was born from a desire
                  to democratize quality education across the country.
                </p>
                <div className="flex items-center space-x-2">
                  <Heart className="h-5 w-5" />
                  <span className="font-medium">Made with ❤️ in Ghana</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GES Alignment Section */}
      <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Aligned with GES Curriculum
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every lesson, quiz, and learning material is carefully crafted to
              match the official Ghana Education Service curriculum standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                English Language
              </h3>
              <p className="text-gray-600">
                Comprehensive coverage of grammar, vocabulary, reading
                comprehension, and essay writing as outlined in the GES
                syllabus.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Mathematics
              </h3>
              <p className="text-gray-600">
                From basic arithmetic to complex problem-solving, covering all
                math topics required for JHS 1, 2, and 3 students.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <div className="bg-earth/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-earth" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Integrated Science
              </h3>
              <p className="text-gray-600">
                Biology, Chemistry, and Physics fundamentals that prepare
                students for advanced scientific studies in senior high school.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Our Commitment to Excellence
            </h2>
            <p className="text-lg text-gray-600">
              We're dedicated to providing the highest quality educational
              experience for Ghanaian students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Expert Content
                </h3>
              </div>
              <p className="text-gray-600">
                All content is created and reviewed by certified Ghanaian
                teachers with years of JHS teaching experience.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-secondary" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Continuous Updates
                </h3>
              </div>
              <p className="text-gray-600">
                We regularly update our content to reflect any changes in the
                GES curriculum and incorporate student feedback.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Local Understanding
                </h3>
              </div>
              <p className="text-gray-600">
                Built by Ghanaians for Ghanaians, we understand the unique
                challenges and opportunities in our educational landscape.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-secondary" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Student Success
                </h3>
              </div>
              <p className="text-gray-600">
                Our platform has helped thousands of students improve their
                grades and gain confidence in their studies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Subjects Importance */}
      <section className="bg-gradient-to-r from-primary to-secondary py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8 text-white">
          <h2 className="text-3xl md:text-4xl font-bold">
            Why English, Math, and Science Matter
          </h2>
          <p className="text-xl opacity-90 leading-relaxed">
            These three core subjects form the foundation of academic success
            and open doors to countless opportunities in higher education and
            career advancement.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="space-y-3">
              <h3 className="text-xl font-semibold">English Language</h3>
              <p className="opacity-90">
                The gateway to effective communication, critical thinking, and
                success in all other subjects.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold">Mathematics</h3>
              <p className="opacity-90">
                Develops logical reasoning and problem-solving skills essential
                for STEM careers.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold">Integrated Science</h3>
              <p className="opacity-90">
                Builds scientific literacy and prepares students for advanced
                science courses.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
