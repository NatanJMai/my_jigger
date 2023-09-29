FactoryBot.define do
  factory :menu do
    name { Faker::Company.name }
    description { Faker::ChuckNorris.fact }
    organization { association :organization }
    status { true }
  end
end
