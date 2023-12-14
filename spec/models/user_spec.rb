require 'rails_helper'

RSpec.describe User, type: :model do
  it "should create valid user" do
    c = create(:normal_user)
    expect(c.valid?).to eq(true)
  end
end
