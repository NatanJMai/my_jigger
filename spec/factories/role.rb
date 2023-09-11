FactoryBot.define do
  factory :role, class: "Role" do
    name { Faker::Company.name }
    description { Faker::ChuckNorris.fact }
    department { association :department }
    permission { 0 }
    status { true }
  end
end
