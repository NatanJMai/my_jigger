FactoryBot.define do
  factory :normal_user, class: "User" do
    email {Faker::Internet.email}
    password {"password"}
  end

  factory :admin_user, class: "User" do
    email {Faker::Internet.email}
    password {"password"}
  end
end
