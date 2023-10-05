import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import validator from 'validator';
import { Button, ButtonBase, Typography, Drawer, Switch, TextField, List, ListItemIcon, ListItemText } from '@mui/material';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { socialPlatforms } from '../../setup/setup';
import { LinkType } from '../../types/profile';

interface LinksCreatorProps {
  links: {
    social: LinkType[];
    custom: LinkType[];
  };
  setLinks: React.Dispatch<React.SetStateAction<{
    social: LinkType[];
    custom: LinkType[];
  }>>;
}

const LinksCreator: React.FC<LinksCreatorProps> = ({ links, setLinks }) => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState,
  } = useForm<LinkType>({ mode: 'onChange' });
  const { errors } = formState;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isPlatformDrawerOpen, setIsPlatformDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingLinkIndex, setEditingLinkIndex] = useState<number | null>(null);
  const isSocial = watch('isSocial', false);
  const isActive = watch('active', true);
  const errorForUrl = errors && errors.url;

  const onSubmit = (data: LinkType) => {
    let newLinks = { ...links };
    const newLinkData = {
      ...data,
      active: data.active ?? true,
      position: isEditing && editingLinkIndex !== null
        ? data.isSocial
          ? newLinks.social[editingLinkIndex].position
          : newLinks.custom[editingLinkIndex].position
        : data.isSocial
          ? newLinks.social.length
          : newLinks.custom.length
    };

    if (data.isSocial) {
      if (isEditing && editingLinkIndex !== null) {
        newLinks.social[editingLinkIndex] = newLinkData;
      } else {
        newLinks.social = [...newLinks.social, newLinkData];
      }
    } else {
      if (isEditing && editingLinkIndex !== null) {
        newLinks.custom[editingLinkIndex] = newLinkData;
      } else {
        newLinks.custom = [...newLinks.custom, newLinkData];
      }
    }

    setLinks(newLinks);
    setIsEditing(false);
    setEditingLinkIndex(null);
    setDrawerOpen(false);
    reset({
      active: true,
      position: 0,
      isSocial: false,
      isCustom: false,
      platform: "",
      url: "",
      title: "",
    });
  };

  const handleAddLink = (isSocial: boolean, platform?: string) => {
    if (platform) {
      setValue('platform', platform);
    }

    if (isSocial) {
      setValue('isSocial', true);
      setValue('isCustom', false);
    } else {
      setValue('isSocial', false);
      setValue('isCustom', true);
    }

    setIsEditing(false);
    setDrawerOpen(true);
  };

  const handleEditLink = (index: number, isSocialLink: boolean) => {
    const linkToEdit = isSocialLink ? links.social[index] : links.custom[index];

    for (const [key, value] of Object.entries(linkToEdit)) {
      setValue(key as keyof LinkType, value);
    }

    setValue('isSocial', isSocialLink);
    setValue('isCustom', !isSocialLink);

    setIsEditing(true);
    setEditingLinkIndex(index);
    setDrawerOpen(true);
  };

  const handleDeleteLink = (index: number, isSocialLink: boolean) => {
    let linkToDelete = isSocialLink ? links.social[index] : links.custom[index];
    let message = isSocialLink
      ? `Are you sure you want to delete ${linkToDelete.platform}?`
      : `Are you sure you want to delete ${linkToDelete.title}?`;

    if (!window.confirm(message)) {
      return; // if the user clicks 'Cancel' on the confirmation dialog, exit without deleting
    }

    // Create a new copy of the links
    let newSocialLinks = [...links.social];
    let newCustomLinks = [...links.custom];

    if (isSocialLink) {
      newSocialLinks.splice(index, 1);
    } else {
      newCustomLinks.splice(index, 1);
    }

    // Recalculate positions for social links
    const updatedSocialLinks = newSocialLinks.map((link, idx) => {
      return { ...link, position: idx };
    });

    // Recalculate positions for custom links
    const updatedCustomLinks = newCustomLinks.map((link, idx) => {
      return { ...link, position: idx };
    });

    setLinks({
      social: isSocialLink ? updatedSocialLinks : links.social,
      custom: isSocialLink ? links.custom : updatedCustomLinks
    });
  };




  // const onDragEnd = (result: DropResult) => {
  //   const { source, destination } = result;

  //   // If item is dropped outside the list, do nothing
  //   if (!destination) return;

  //   // If the item is dropped in the same place, do nothing
  //   if (source.index === destination.index && source.droppableId === destination.droppableId) return;

  //   const start = source.droppableId === 'social' ? links.social : links.custom;
  //   const finish = destination.droppableId === 'social' ? links.social : links.custom;

  //   const [removed] = start.splice(source.index, 1);
  //   finish.splice(destination.index, 0, removed);

  //   if (source.droppableId === destination.droppableId) {
  //     setLinks(prev => ({
  //       ...prev,
  //       [source.droppableId]: start
  //     }));
  //   } else {
  //     setLinks(prev => ({
  //       ...prev,
  //       [source.droppableId]: start,
  //       [destination.droppableId]: finish
  //     }));
  //   }
  // };
  //   useEffect(() => {
  //     console.log("Links state has changed:", links);
  // }, [links]);
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // If item is dropped outside the list, do nothing
    if (!destination) return;

    // If the item is dropped in the same place, do nothing
    if (source.index === destination.index && source.droppableId === destination.droppableId) return;

    // Deep clone the current links state
    const newLinks = JSON.parse(JSON.stringify(links));

    // Reorder the links based on drag and drop result
    const [removed] = newLinks[source.droppableId].splice(source.index, 1);
    newLinks[destination.droppableId].splice(destination.index, 0, removed);

    // Update the positions for all links in both source and destination lists
    [source.droppableId, destination.droppableId].forEach(id => {
      newLinks[id].forEach((link: LinkType, index: number) => {
        link.position = index;
      });
    })

    setLinks(newLinks);
  };


  console.log(socialPlatforms);


  return (
    <div>
      <div>
        <div>
          <Typography variant="h6">Social Links:</Typography>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="social">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {links.social.map((link, index) => (
                    <Draggable key={link.platform} draggableId={link.platform} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <div key={index}>
                            {link.platform}: {link.url} : {link.active ? 'active' : 'inactive'}
                            <Button onClick={() => handleEditLink(index, true)}>Edit</Button>
                            <Button onClick={() => handleDeleteLink(index, true)}>Delete</Button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <Button onClick={() => setIsPlatformDrawerOpen(true)}>Add Social Link</Button>
        </div>

        <div>
          <Typography variant="h6">Custom Links:</Typography>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="custom">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {links.custom.map((link, index) => (
                    <Draggable
                      key={`${link.url.replace(/\s+/g, '')}${link.title && link.title.replace(/\s+/g, '')}`}
                      draggableId={`${link.url.replace(/\s+/g, '')}${link.title && link.title.replace(/\s+/g, '')}`}
                      index={index}
                    >
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <div key={index}>
                            {link.title}: {link.url} : {link.active ? 'active' : 'inactive'}
                            <Button onClick={() => handleEditLink(index, false)}>Edit</Button>
                            <Button onClick={() => handleDeleteLink(index, false)}>Delete</Button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <Button onClick={() => handleAddLink(false, 'custom')}>Add Custom Link</Button>
        </div>
      </div>

      <Drawer anchor="bottom" open={isPlatformDrawerOpen} onClose={() => setIsPlatformDrawerOpen(false)}>
        <div>
          <Typography variant="h6">Select a Social Platform</Typography>
          <List>
            {socialPlatforms.map(platform => (
              <ButtonBase
                key={platform.platform}
                style={{ width: '100%' }}
                onClick={() => {
                  setIsPlatformDrawerOpen(false);
                  handleAddLink(true, platform.platform);
                }}
                disabled={links.social.some(link => link.platform === platform.platform)}
              >
                <ListItemIcon>
                  {/* You can render an icon here if you have it, using platform.iconColor */}
                </ListItemIcon>
                <ListItemText primary={platform.platform} />
              </ButtonBase>
            ))}
          </List>
        </div>
      </Drawer>

      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setIsEditing(false);
          setEditingLinkIndex(null);
          reset({
            active: true,
            position: 0,
            isSocial: false,
            isCustom: false,
            platform: "",
            url: "",
            title: "",
          });
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          {isEditing && (
            <Controller
              name="active"
              control={control}
              defaultValue={false}
              render={({ field }) => <Switch checked={field.value} onChange={e => setValue('active', e.target.checked)} />}
            />
          )}

          <Controller
            name="url"
            control={control}
            defaultValue=""
            rules={{
              required: "URL is required",
              validate: value => {
                console.log("Validating URL:", value);
                return validator.isURL(value, { require_protocol: true }) || "Please enter a valid URL";
              }
            }}
            render={({ field }) => (
              <TextField
                label="URL"
                {...field}
                disabled={!isActive}
                error={Boolean(errorForUrl)}
                helperText={errorForUrl?.message}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (!inputValue.startsWith("https://") && !inputValue.startsWith("http://")) {
                    e.target.value = "https://" + inputValue;
                  }
                  field.onChange(e);
                }}

              />
            )}
          />

          {drawerOpen && !isSocial && (
            <Controller
              name="title"
              control={control}
              defaultValue=""
              rules={{
                required: "Title is required"
              }}
              render={({ field: { ref, ...inputProps } }) => (
                <TextField label="Title" inputRef={ref} {...inputProps} disabled={!isActive} />
              )}
            />
          )}

          <Button type="submit" disabled={!formState.isValid}>Save</Button>
        </form>

      </Drawer>
    </div>
  );
}

export default LinksCreator;
