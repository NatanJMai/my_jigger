require 'rails_helper'

RSpec.describe "departments/new", type: :view do
  before(:each) do
    assign(:department, Department.new())
  end

  it "renders new department form" do
    render

    assert_select "form[action=?][method=?]", departments_path, "post" do
    end
  end
end
