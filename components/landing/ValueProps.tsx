import { Card, CardContent } from "@/components/ui/card";

export function ValueProps() {
  const values = [
    {
      title: "Affordable",
      description:
        "Most professional career coaches charge $500 or more per hour for their time. Seriously. We are not for the 1%. They've got theirs. We are here for the underrepresented, underutilized and undervalued.",
      icon: (
        <svg
          className="w-12 h-12 text-brand-red"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      illustration: (
        <div className="w-full h-48 bg-gradient-to-br from-brand-pink to-white rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl font-bold text-brand-red mb-2">$150</div>
            <div className="text-gray-600 line-through text-xl">$500</div>
            <div className="mt-2 inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
              70% savings
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Approachable",
      description:
        "There are so many coaches out there!! How to pick one? Are they qualified? We take the guess work out. All of our coaches are certified and thoroughly vetted to ensure their values and ethics align with ours.",
      icon: (
        <svg
          className="w-12 h-12 text-brand-red"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      illustration: (
        <div className="w-full h-48 bg-gradient-to-br from-brand-pink to-white rounded-lg flex items-center justify-center p-6">
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="w-12 h-12 rounded-full bg-brand-maroon opacity-80"
              ></div>
            ))}
          </div>
          <div className="absolute">
            <svg
              className="w-16 h-16 text-brand-red"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      ),
    },
    {
      title: "Actionable",
      description:
        "We are about progress, not platitudes. It's designed to be a transformative experience that takes you to new heights. We equip you with the tools, skills and blueprint to own your future because you've got this. It's all within.",
      icon: (
        <svg
          className="w-12 h-12 text-brand-red"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      illustration: (
        <div className="w-full h-48 bg-gradient-to-br from-brand-pink to-white rounded-lg flex items-center justify-center">
          <div className="relative">
            <svg
              className="w-32 h-32 text-brand-red"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-brand-red rounded-full animate-ping opacity-75"></div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-brand-pink">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-brand-dark mb-4">
            Why choose SANDWINA?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We exist to make lives better, paychecks bigger and jobs more fulfilling.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value) => (
            <Card
              key={value.title}
              className="border-2 border-brand-red/10 hover:border-brand-red/30 transition-all duration-300 hover:shadow-xl"
            >
              <CardContent className="p-8">
                {/* Illustration */}
                <div className="mb-6">{value.illustration}</div>

                {/* Icon & Title */}
                <div className="flex items-center gap-3 mb-4">
                  {value.icon}
                  <h3 className="font-heading text-2xl font-bold text-brand-dark">
                    {value.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
