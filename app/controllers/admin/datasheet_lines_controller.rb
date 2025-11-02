class Admin::DatasheetLinesController < AdminController
  load_and_authorize_resource
  load_and_authorize_resource :item
  before_action :set_datasheet

  decorates_assigned :item
  decorates_assigned :datasheet
  decorates_assigned :datasheet_line
  decorates_assigned :organization

  def index
    @datasheet_lines = @datasheet.datasheet_lines
  end

  # GET /items/1 or /items/1.json
  def show
  end

  def edit
    respond_to do |format|
      format.turbo_stream {}
    end
  end

  def new_line
    @organization = @datasheet.item.organization
    @ingredients = @organization.ingredients.order(:name)
    @datasheet_line = @datasheet.datasheet_lines.build
    @datasheet_line.build_ingredient

    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.append(
          :list,
          partial: 'admin/datasheet_lines/new_line',
          locals: { datasheet_line: @datasheet_line, model: [:admin, @item, @datasheet, @datasheet_line] }
        )
      end
    end
  end

  # POST /items or /items.json
  def create
    @datasheet_line = @datasheet.datasheet_lines.new(datasheet_line_params)

    if @datasheet_line.save
      respond_to do |format|
        format.turbo_stream do
          render turbo_stream: turbo_stream.replace(
            dom_id(@datasheet_line, :form),
            partial: "admin/datasheet_lines/line",
            locals: { datasheet_line: @datasheet_line }
          )
        end
        format.html { redirect_to admin_item_datasheet_path(@datasheet.item, @datasheet) }
      end
    else
      respond_to do |format|
        format.turbo_stream do
          render turbo_stream: turbo_stream.replace(
            dom_id(@datasheet_line, :form),
            partial: "admin/datasheet_lines/new_line",
            locals: { datasheet_line: @datasheet_line }
          )
        end
      end
    end
  end


  # PATCH/PUT /items/1 or /items/1.json
  def update
    respond_to do |format|
      if @datasheet_line.update(datasheet_line_params)
        format.turbo_stream {}
        format.json { render :show, status: :ok, location: @datasheet_line }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @datasheet_line.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /items/1 or /items/1.json
  def destroy
    @datasheet = @datasheet_line.datasheet
    @datasheet_line.destroy

    respond_to do |format|
      format.turbo_stream {}
      format.html {
        redirect_to admin_datasheet_path(@datasheet), notice: 'Item was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

  def set_datasheet
    @datasheet = @item&.datasheet
  end

  # Only allow a list of trusted parameters through.
  def datasheet_line_params
    params.require(:datasheet_line).permit(:datasheet_id,
                                           :item_id,
                                           :ingredient_id,
                                           :unit,
                                           :quantity,
                                           :volume,
                                           :cost,
                                           ingredient_attributes: [:name, :unit])
  end
end
