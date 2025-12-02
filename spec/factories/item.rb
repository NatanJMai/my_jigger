FactoryBot.define do
  factory :item do
    name { Faker::Company.name }
    organization
    status { true }
  end
end
