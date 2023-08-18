require 'rails_helper'

RSpec.describe "departments/index", type: :view do
  before(:each) do
    assign(:departments, [
      Department.create!(),
      Department.create!()
    ])
  end

  it "renders a list of departments" do
    render
    cell_selector = Rails::VERSION::STRING >= '7' ? 'div>p' : 'tr>td'
  end
end
