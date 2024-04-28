FactoryBot.define do
  factory :organization, class: "Organization" do
    name { Faker::Company.name }
    address { Faker::Address.street_address }
    site { Faker::Internet.url }
    phone { Faker::Company.australian_business_number }
    email { Faker::Internet.email }
    manager { association :admin_user }
    status { true }
  end
end
