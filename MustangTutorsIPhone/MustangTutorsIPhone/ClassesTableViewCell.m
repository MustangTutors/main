//
//  ClassesTableViewCell.m
//  MustangTutorsIPhone
//
//  Created by Tyler JACKSON on 4/15/14.
//  Copyright (c) 2014 Tyler JACKSON. All rights reserved.
//

#import "ClassesTableViewCell.h"

@implementation ClassesTableViewCell

- (id)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier
{
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    if (self) {
        // Initialization code
    }
    return self;
}

- (void)awakeFromNib
{
    // Initialization code
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated
{
    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
}

@end
