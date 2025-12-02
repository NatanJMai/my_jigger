FactoryBot.define do
  factory :product do
    name { Faker::Company.name }
    organization { association :organization }
    status { true }
  end
end
