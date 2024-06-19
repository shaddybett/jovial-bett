"""Changed relationship from service model to provider service

Revision ID: 9926e0627aca
Revises: b2ca6c1fd954
Create Date: 2024-06-19 19:00:13.233631

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9926e0627aca'
down_revision = 'b2ca6c1fd954'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('provider_services', schema=None) as batch_op:
        batch_op.drop_constraint('provider_services_county_id_fkey', type_='foreignkey')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('provider_services', schema=None) as batch_op:
        batch_op.create_foreign_key('provider_services_county_id_fkey', 'counties', ['county_id'], ['id'])

    # ### end Alembic commands ###
