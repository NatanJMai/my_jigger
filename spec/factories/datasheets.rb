FactoryBot.define do
  factory :datasheet do
    name { Faker::Lorem.word }
    association :item
  end
end