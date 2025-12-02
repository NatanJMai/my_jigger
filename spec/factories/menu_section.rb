FactoryBot.define do
  factory :menu_section do
    name { Faker::Company.name }
    menu { association :menu }
    status { true }
  end
end
