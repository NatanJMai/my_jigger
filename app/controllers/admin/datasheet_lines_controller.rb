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

  def new
    @organization = @datasheet.item.organization
    @ingredients = @organization.ingredients.order(:name)
    @datasheet_line = @datasheet.datasheet_lines.build
    @datasheet_line.build_ingredient
  end

  # POST /items or /items.json
  def create
    @datasheet_line = @datasheet.datasheet_lines.build(datasheet_line_params)

    if @datasheet_line.save
      respond_to do |format|
        format.turbo_stream
        format.html { redirect_to admin_item_datasheet_path(@item, @datasheet) }
      end
    else
      render :new, status: :unprocessable_entity
    end
  end


  # PATCH/PUT /items/1 or /items/1.json
  def update
    respond_to do |format|
      if @datasheet_line.update(datasheet_line_params)
        totals_update_stream = render_to_string(
          partial: 'admin/datasheet_lines/totals_update', # Use a dedicated partial
          locals: {
            datasheet: @datasheet_line.datasheet,
            item: @datasheet_line.datasheet.item
          }
        )

        format.turbo_stream
        format.json do
          render json: {
            # Direct JSON output with the humanized calculated price
            # Ensure datasheet_line.calculated_price returns a numeric value
            calculated_price: helpers.humanized_money_with_symbol(Money.new(@datasheet_line.calculated_price)),
            turbo_stream_updates: totals_update_stream
          }, status: :ok
        end
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json {
          render json: { errors: @datasheet_line.errors.full_messages }, status: :unprocessable_entity
        }
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
